import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Flag, Check } from 'lucide-react';
import { useTimerStore, formatTime, TimerStatus } from '../../store/timerStore';

interface StopwatchTimerProps {
  id: string;
  name: string;
  elapsed: number;
  status: TimerStatus;
  laps: number[];
}

const StopwatchTimer: React.FC<StopwatchTimerProps> = ({
  id,
  name,
  elapsed,
  status,
  laps
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  
  const { startTimer, pauseTimer, resetTimer, addLap, removeTimer } = useTimerStore();
  
  const handleSaveEdit = () => {
    // In a real app, we would update the timer with new values
    setIsEditing(false);
  };
  
  // Calculate lap differences
  const lapDifferences = laps.map((lap, index, array) => {
    if (index === 0) return lap;
    return lap - array[index - 1];
  });
  
  return (
    <div className="clock-card">
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stopwatch Name
            </label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="input w-full"
              placeholder="Stopwatch Name"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="btn btn-primary"
            >
              <Check size={16} className="mr-1" />
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Stopwatch
              </p>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => resetTimer(id)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Reset timer"
              >
                <RotateCcw size={18} className="text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="my-4 flex flex-col items-center">
            <p className="text-3xl font-mono font-semibold text-gray-900 dark:text-white">
              {formatTime(elapsed)}
            </p>
            
            <div className="flex space-x-3 mt-4">
              {status === 'running' ? (
                <>
                  <button
                    onClick={() => pauseTimer(id)}
                    className="btn btn-secondary"
                  >
                    <Pause size={18} className="mr-1" />
                    Pause
                  </button>
                  <button
                    onClick={() => addLap(id)}
                    className="btn btn-primary"
                  >
                    <Flag size={18} className="mr-1" />
                    Lap
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startTimer(id)}
                    className="btn btn-primary"
                  >
                    <Play size={18} className="mr-1" />
                    {status === 'paused' ? 'Resume' : 'Start'}
                  </button>
                  <button
                    onClick={() => resetTimer(id)}
                    className="btn btn-secondary"
                  >
                    <RotateCcw size={18} className="mr-1" />
                    Reset
                  </button>
                </>
              )}
            </div>
            
            {laps.length > 0 && (
              <div className="w-full mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                <h4 className="text-sm font-medium mb-2">Laps</h4>
                <div className="max-h-40 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 dark:text-gray-400">
                        <th className="pb-2 font-medium">#</th>
                        <th className="pb-2 font-medium">Lap Time</th>
                        <th className="pb-2 font-medium">Total Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {laps.map((lap, index) => (
                        <tr key={index} className="border-t border-gray-100 dark:border-gray-800">
                          <td className="py-1.5">{laps.length - index}</td>
                          <td className="py-1.5 font-mono">
                            {formatTime(lapDifferences[index], false)}
                          </td>
                          <td className="py-1.5 font-mono">
                            {formatTime(lap, false)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-4 flex justify-between items-center">
            <span>{laps.length} laps</span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-primary-500 hover:underline"
            >
              Edit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StopwatchTimer;