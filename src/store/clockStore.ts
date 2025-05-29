import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import allTimezones from '../data/timezones.json'; // Import the timezone data

export interface TimeZone {
  id: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  offset: string;
  coordinates: [number, number];
  favorite: boolean;
  flag?: string; // Optional flag property
}

interface ClockState {
  currentTime: Date;
  selectedTimeZone: TimeZone | null;
  showMap: boolean;
  
  // Actions
  removeTimeZone: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setSelectedTimeZone: (timeZone: TimeZone | null) => void;
  toggleMap: () => void;
  updateCurrentTime: () => void;
  
  // New state and actions for comprehensive timezones and added clocks
  allTimezonesData: TimeZone[];
  addedTimeZones: TimeZone[];
  addUserTimeZone: (timeZone: TimeZone) => void;
}

export const useClockStore = create<ClockState>()(
  persist(
    (set) => ({
      currentTime: new Date(),
      selectedTimeZone: null,
      showMap: false,

      removeTimeZone: (id: string) => {
        set(state => ({
          addedTimeZones: state.addedTimeZones.filter((tz: TimeZone) => tz.id !== id)
        }));
      },

      toggleFavorite: (id: string) => {
        set(state => ({
          addedTimeZones: state.addedTimeZones.map(tz => 
            tz.id === id ? { ...tz, favorite: !tz.favorite } : tz
          ) as TimeZone[]
        }));
      },

      setSelectedTimeZone: (timeZone: TimeZone | null) => {
        set({ selectedTimeZone: timeZone });
      },

      toggleMap: () => {
        set(state => ({ showMap: !state.showMap }));
      },

      updateCurrentTime: () => {
        set({ currentTime: new Date() });
      },

      allTimezonesData: allTimezones as TimeZone[],
      addedTimeZones: [
        {
          id: '1',
          name: 'New York',
          city: 'New York',
          country: 'USA',
          timezone: 'America/New_York',
          offset: 'UTC-5',
          coordinates: [-74.006, 40.7128],
          favorite: false,
        },
        {
          id: '2',
          name: 'London',
          city: 'London',
          country: 'UK',
          timezone: 'Europe/London',
          offset: 'UTC+0',
          coordinates: [-0.1278, 51.5074],
          favorite: false,
        },
        {
          id: '3',
          name: 'Tokyo',
          city: 'Tokyo',
          country: 'Japan',
          timezone: 'Asia/Tokyo',
          offset: 'UTC+9',
          coordinates: [139.6503, 35.6762],
          favorite: false,
        }
      ],
      addUserTimeZone: (timeZone: TimeZone) => {
        set(state => {
          // Check if timezone already exists in addedTimeZones
          const exists = state.addedTimeZones.some(tz => tz.timezone === timeZone.timezone);
          // Check if the limit of 12 has been reached
          const isLimitReached = state.addedTimeZones.length >= 12;

          if (!exists && !isLimitReached) {
            return { addedTimeZones: [...state.addedTimeZones, timeZone] };
          }
          // If exists or limit reached, return current state
          return state;
        });
      }
    }),
    {
      name: 'world-clock-storage',
      partialize: (state): Partial<ClockState> => ({
        addedTimeZones: state.addedTimeZones,
      }),
    }
  )
);

// Helper function to format time for a timezone
export const formatTimeForTimeZone = (date: Date, timeZone: string, format24h = false) => {
  try {
    return formatInTimeZone(
      date, 
      timeZone, 
      format24h ? 'HH:mm:ss' : 'h:mm:ss a'
    );
  } catch (error) {
    console.error('Error formatting time for timezone:', error);
    return format(date, format24h ? 'HH:mm:ss' : 'h:mm:ss a');
  }
};

// Format date for timezone
export const formatDateForTimeZone = (date: Date, timeZone: string) => {
  try {
    return formatInTimeZone(date, timeZone, 'EEEE, MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date for timezone:', error);
    return format(date, 'EEEE, MMMM d, yyyy');
  }
};