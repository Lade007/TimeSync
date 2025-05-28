import React, { useEffect } from 'react';
import { Timer, Clock } from 'lucide-react';
import { useTimerStore } from '../../store/timerStore';
import CountdownTimer from './CountdownTimer';
import StopwatchTimer from './StopwatchTimer';
import CreateTimer from './CreateTimer';

const TimersView: React.FC = () => {
  const { timers, updateTimers } = useTimerStore();
  
  // Update running timers every 100ms
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateTimers();
    }, 100);
    
    return () => clearInterval(intervalId);
  }, [updateTimers]);
  
  // Group timers by type for better organization
  const countdownTimers = timers.filter(timer => timer.mode === 'countdown');
  const stopwatchTimers = timers.filter(timer => timer.mode === 'stopwatch');
  
  return (
    <div className="section">
      <div className="mb-6">
        <CreateTimer />
      </div>
      
      {timers.length === 0 ? (
        <div className="clock-card flex flex-col items-center justify-center py-10">
          <Timer size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            No timers created yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
            Create a countdown timer or stopwatch to get started. Track time with precision.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {countdownTimers.length > 0 && (
            <div>
              <div className="flex items-center mb-4">
                <Clock size={18} className="text-primary-500 mr-2" />
                <h2 className="text-xl font-semibold">Countdown Timers</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {countdownTimers.map(timer => (
                  <CountdownTimer
                    key={timer.id}
                    id={timer.id}
                    name={timer.name}
                    duration={timer.duration}
                    elapsed={timer.elapsed}
                    status={timer.status}
                  />
                ))}
              </div>
            </div>
          )}
          
          {stopwatchTimers.length > 0 && (
            <div>
              <div className="flex items-center mb-4">
                <Timer size={18} className="text-primary-500 mr-2" />
                <h2 className="text-xl font-semibold">Stopwatches</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stopwatchTimers.map(timer => (
                  <StopwatchTimer
                    key={timer.id}
                    id={timer.id}
                    name={timer.name}
                    elapsed={timer.elapsed}
                    status={timer.status}
                    laps={timer.laps}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimersView;