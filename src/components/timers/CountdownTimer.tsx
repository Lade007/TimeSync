import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';
import { useTimerStore, formatTime, TimerStatus } from '../../store/timerStore';

interface CountdownTimerProps {
  id: string;
  name: string;
  duration: number;
  elapsed: number;
  status: TimerStatus;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  id,
  name,
  duration,
  elapsed,
  status
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedHours, setEditedHours] = useState(Math.floor(duration / 3600));
  const [editedMinutes, setEditedMinutes] = useState(Math.floor((duration % 3600) / 60));
  const [editedSeconds, setEditedSeconds] = useState(duration % 60);
  
  const { startTimer, pauseTimer, resetTimer } = useTimerStore();
  
  // Calculate remaining time
  const totalDurationMs = duration * 1000;
  const remainingMs = Math.max(0, totalDurationMs - elapsed);
  const progress = totalDurationMs > 0 ? elapsed / totalDurationMs : 0;
  const percentage = Math.min(100, Math.max(0, progress * 100));
  
  const handleSaveEdit = () => {
    // In a real app, we would update the timer with new values
    // For this demo, we'll just close the edit mode
    setIsEditing(false);
  };
  
  return (
    <div className="clock-card">
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label htmlFor="editTimerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Timer Name
            </label>
            <input
              type="text"
              id="editTimerName"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="input w-full"
              placeholder="Timer Name"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="editHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hours
              </label>
              <input
                type="number"
                id="editHours"
                min="0"
                max="23"
                value={editedHours}
                onChange={(e) => setEditedHours(parseInt(e.target.value) || 0)}
                className="input w-full"
              />
            </div>
            <div>
              <label htmlFor="editMinutes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Minutes
              </label>
              <input
                type="number"
                id="editMinutes"
                min="0"
                max="59"
                value={editedMinutes}
                onChange={(e) => setEditedMinutes(parseInt(e.target.value) || 0)}
                className="input w-full"
              />
            </div>
            <div>
              <label htmlFor="editSeconds" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Seconds
              </label>
              <input
                type="number"
                id="editSeconds"
                min="0"
                max="59"
                value={editedSeconds}
                onChange={(e) => setEditedSeconds(parseInt(e.target.value) || 0)}
                className="input w-full"
              />
            </div>
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
                {status === 'completed' ? (
                  <span className="text-success-700 font-semibold">Completed</span>
                ) : (
                  'Countdown Timer'
                )}
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
            <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
              <div 
                className={`absolute left-0 top-0 h-full ${
                  status === 'completed' 
                    ? 'bg-success-500' 
                    : 'bg-primary-500'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            
            <p className="text-3xl font-mono font-semibold text-gray-900 dark:text-white">
              {formatTime(remainingMs)}
            </p>
            
            <div className="flex space-x-3 mt-4">
              {status === 'running' ? (
                <button
                  onClick={() => pauseTimer(id)}
                  className="btn btn-secondary"
                >
                  <Pause size={18} className="mr-1" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={() => startTimer(id)}
                  className="btn btn-primary"
                  disabled={status === 'completed'}
                >
                  <Play size={18} className="mr-1" />
                  {status === 'paused' ? 'Resume' : 'Start'}
                </button>
              )}
              
              <button
                onClick={() => resetTimer(id)}
                className="btn btn-secondary"
              >
                <RotateCcw size={18} className="mr-1" />
                Reset
              </button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-4 flex justify-between items-center">
            <span>Duration: {formatTime(duration * 1000)}</span>
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

export default CountdownTimer;