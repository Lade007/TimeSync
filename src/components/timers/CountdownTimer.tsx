import React, { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTimerStore, formatTime, TimerStatus } from '../../store/timerStore';
import CountdownTimerEditForm from './CountdownTimerEditForm';

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
  
  const { startTimer, pauseTimer, resetTimer, updateTimer } = useTimerStore();
  
  // Calculate remaining time
  const totalDurationMs = duration * 1000;
  const remainingMs = Math.max(0, totalDurationMs - elapsed);
  const progress = totalDurationMs > 0 ? elapsed / totalDurationMs : 0;
  const percentage = Math.min(100, Math.max(0, progress * 100));
  
  const handleSaveEdit = (newName: string, newDuration: number) => {
    updateTimer(id, newName, newDuration);
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  return (
    <div className={`clock-card ${status === 'completed' ? 'border-success-500 border-4' : status === 'running' ? 'border-primary-500 border-4' : status === 'paused' ? 'border-secondary-500 border-4' : ''}`}>
      {isEditing ? (
        <CountdownTimerEditForm
          initialName={name}
          initialDuration={duration}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
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
                <RotateCcw size={18} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
          
          <div className="my-6 flex flex-col items-center">
            <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
              <div 
                className={`absolute left-0 top-0 h-full ${
                  status === 'completed' 
                    ? 'bg-success-500' 
                    : 'bg-primary-500'
                }`}
                style={{
                  width: `${percentage}%`,
                  transition: 'width 0.1s linear',
                }}
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