import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimerMode = 'countdown' | 'stopwatch';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

interface Timer {
  id: string;
  name: string;
  mode: TimerMode;
  duration: number; // in seconds (for countdown)
  elapsed: number; // in milliseconds
  status: TimerStatus;
  startTime: number | null; // timestamp when timer started
  endTime: number | null; // timestamp when timer should end (for countdown)
  laps: number[]; // timestamps for stopwatch laps
}

interface TimerState {
  timers: Timer[];
  activeTimerId: string | null;
  
  // Actions
  createTimer: (name: string, mode: TimerMode, duration?: number) => string;
  removeTimer: (id: string) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  resetTimer: (id: string) => void;
  addLap: (id: string) => void;
  updateTimers: () => void;
  setActiveTimer: (id: string | null) => void;
  updateTimer: (id: string, name: string, duration: number) => void;
  updateStopwatchTimerName: (id: string, name: string) => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      timers: [],
      activeTimerId: null,

      createTimer: (name, mode, duration = 60) => {
        const id = Date.now().toString();
        
        const newTimer: Timer = {
          id,
          name: name || (mode === 'countdown' ? 'Countdown' : 'Stopwatch'),
          mode,
          duration: duration,
          elapsed: 0,
          status: 'idle',
          startTime: null,
          endTime: null,
          laps: [],
        };
        
        set(state => ({
          timers: [...state.timers, newTimer],
          activeTimerId: id
        }));
        
        return id;
      },

      removeTimer: (id) => {
        set(state => {
          const newActiveId = state.activeTimerId === id
            ? state.timers.find(t => t.id !== id)?.id || null
            : state.activeTimerId;
            
          return {
            timers: state.timers.filter(timer => timer.id !== id),
            activeTimerId: newActiveId
          };
        });
      },

      startTimer: (id) => {
        set(state => {
          const now = Date.now();
          
          return {
            timers: state.timers.map(timer => {
              if (timer.id !== id) return timer;
              
              // If timer was already started and paused
              if (timer.status === 'paused') {
                const remaining = timer.mode === 'countdown' 
                  ? (timer.duration * 1000) - timer.elapsed
                  : 0;
                  
                return {
                  ...timer,
                  status: 'running',
                  startTime: now - timer.elapsed,
                  endTime: timer.mode === 'countdown' ? now + remaining : null
                };
              }
              
              // Starting a fresh timer
              return {
                ...timer,
                status: 'running',
                startTime: now,
                elapsed: 0,
                endTime: timer.mode === 'countdown' ? now + (timer.duration * 1000) : null,
                laps: []
              };
            })
          };
        });
      },

      pauseTimer: (id) => {
        set(state => ({
          timers: state.timers.map(timer => {
            if (timer.id !== id || timer.status !== 'running') return timer;
            
            const now = Date.now();
            const elapsed = timer.startTime ? now - timer.startTime : timer.elapsed;
            
            return {
              ...timer,
              status: 'paused',
              elapsed
            };
          })
        }));
      },

      resetTimer: (id) => {
        set(state => ({
          timers: state.timers.map(timer => {
            if (timer.id !== id) return timer;
            
            return {
              ...timer,
              status: 'idle',
              elapsed: 0,
              startTime: null,
              endTime: null,
              laps: []
            };
          })
        }));
      },

      addLap: (id) => {
        set(state => {
          const now = Date.now();
          
          return {
            timers: state.timers.map(timer => {
              if (timer.id !== id || timer.status !== 'running' || timer.mode !== 'stopwatch') {
                return timer;
              }
              
              const elapsed = timer.startTime ? now - timer.startTime : 0;
              
              return {
                ...timer,
                laps: [...timer.laps, elapsed]
              };
            })
          };
        });
      },

      updateTimers: () => {
        const now = Date.now();
        
        set(state => ({
          timers: state.timers.map(timer => {
            if (timer.status !== 'running') return timer;
            
            // Calculate elapsed time
            const elapsed = timer.startTime ? now - timer.startTime : timer.elapsed;
            
            // For countdown timers, check if completed
            if (timer.mode === 'countdown' && timer.endTime && now >= timer.endTime) {
              return {
                ...timer,
                status: 'completed',
                elapsed: timer.duration * 1000
              };
            }
            
            return {
              ...timer,
              elapsed
            };
          })
        }));
      },

      setActiveTimer: (id) => {
        set({ activeTimerId: id });
      },

      updateTimer: (id, name, duration) => {
        set(state => ({
          timers: state.timers.map(timer => {
            if (timer.id !== id) return timer;
            
            return {
              ...timer,
              name,
              duration,
              status: 'idle',
              elapsed: 0,
              startTime: null,
              endTime: null,
              laps: []
            };
          })
        }));
      },

      updateStopwatchTimerName: (id, name) => {
        set(state => ({
          timers: state.timers.map(timer => {
            if (timer.id !== id || timer.mode !== 'stopwatch') return timer;
            
            return {
              ...timer,
              name
            };
          })
        }));
      }
    }),
    {
      name: 'world-clock-timers',
      partialize: (state) => ({
        timers: state.timers.map(timer => ({
          ...timer,
          // Don't persist running state to avoid issues after reload
          status: timer.status === 'running' ? 'paused' : timer.status
        }))
      }),
    }
  )
);

// Helper function to format time display
export const formatTime = (milliseconds: number, showHours = true) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (showHours) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};