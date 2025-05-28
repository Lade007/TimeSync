import React, { useState } from 'react';
import { Plus, Clock, Timer, X } from 'lucide-react';
import { useTimerStore, TimerMode } from '../../store/timerStore';

const CreateTimer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [timerName, setTimerName] = useState('');
  const [timerMode, setTimerMode] = useState<TimerMode>('countdown');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const { createTimer } = useTimerStore();
  
  const handleCreateTimer = () => {
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    
    // Validation for countdown timer duration
    if (timerMode === 'countdown' && totalSeconds <= 0) {
      setError('Countdown duration must be greater than 0');
      return;
    }

    // Clear any previous errors
    setError(null);

    const name = timerName.trim() || (timerMode === 'countdown' ? 'Countdown' : 'Stopwatch');
    
    createTimer(name, timerMode, totalSeconds);
    resetForm();
  };
  
  const resetForm = () => {
    setTimerName('');
    setTimerMode('countdown');
    setHours(0);
    setMinutes(5);
    setSeconds(0);
    setIsOpen(false);
    setError(null);
  };
  
  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-primary w-full"
        >
          <Plus size={18} className="mr-1" />
          Create New Timer
        </button>
      ) : (
        <div className="clock-card animate-fade-in bg-gray-100 dark:bg-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Create New Timer</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close create timer form"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="timerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timer Name
              </label>
              <input
                type="text"
                id="timerName"
                value={timerName}
                onChange={(e) => setTimerName(e.target.value)}
                className="input w-full"
                placeholder="My Timer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timer Type
              </label>
              <div className="tabs">
                <button
                  onClick={() => setTimerMode('countdown')}
                  className={`tab flex items-center space-x-1.5 ${
                    timerMode === 'countdown' ? 'tab-active' : 'tab-inactive'
                  }`}
                >
                  <Clock size={16} />
                  <span>Countdown</span>
                </button>
                <button
                  onClick={() => setTimerMode('stopwatch')}
                  className={`tab flex items-center space-x-1.5 ${
                    timerMode === 'stopwatch' ? 'tab-active' : 'tab-inactive'
                  }`}
                >
                  <Timer size={16} />
                  <span>Stopwatch</span>
                </button>
              </div>
            </div>
            
            {timerMode === 'countdown' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label htmlFor="countdownHours" className="block text-xs text-gray-500 mb-1">
                      Hours
                    </label>
                    <input
                      type="number"
                      id="countdownHours"
                      min="0"
                      max="23"
                      value={hours}
                      onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                      className="input w-full"
                      aria-label="Hours for countdown duration"
                    />
                  </div>
                  <div>
                    <label htmlFor="countdownMinutes" className="block text-xs text-gray-500 mb-1">
                      Minutes
                    </label>
                    <input
                      type="number"
                      id="countdownMinutes"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                      className="input w-full"
                      aria-label="Minutes for countdown duration"
                    />
                  </div>
                  <div>
                    <label htmlFor="countdownSeconds" className="block text-xs text-gray-500 mb-1">
                      Seconds
                    </label>
                    <input
                      type="number"
                      id="countdownSeconds"
                      min="0"
                      max="59"
                      value={seconds}
                      onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                      className="input w-full"
                      aria-label="Seconds for countdown duration"
                    />
                  </div>
                </div>
                
                {error && (
                  <p className="text-error-700 text-sm mt-2">{error}</p>
                )}

                <div className="grid grid-cols-4 gap-2 mt-3">
                  <button
                    onClick={() => { setMinutes(1); setSeconds(0); setHours(0); }}
                    className="btn btn-secondary py-1 px-2 text-xs"
                  >
                    1 min
                  </button>
                  <button
                    onClick={() => { setMinutes(5); setSeconds(0); setHours(0); }}
                    className="btn btn-secondary py-1 px-2 text-xs"
                  >
                    5 min
                  </button>
                  <button
                    onClick={() => { setMinutes(10); setSeconds(0); setHours(0); }}
                    className="btn btn-secondary py-1 px-2 text-xs"
                  >
                    10 min
                  </button>
                  <button
                    onClick={() => { setMinutes(30); setSeconds(0); setHours(0); }}
                    className="btn btn-secondary py-1 px-2 text-xs"
                  >
                    30 min
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex space-x-2 pt-2">
              <button
                onClick={resetForm}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTimer}
                className="btn btn-primary flex-1"
                disabled={timerMode === 'countdown' && hours === 0 && minutes === 0 && seconds === 0}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTimer;