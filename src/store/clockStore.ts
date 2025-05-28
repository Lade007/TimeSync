import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export interface TimeZone {
  id: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  offset: string;
  coordinates: [number, number];
  favorite: boolean;
}

interface ClockState {
  currentTime: Date;
  timeZones: TimeZone[];
  selectedTimeZone: TimeZone | null;
  showMap: boolean;
  
  // Actions
  addTimeZone: (timeZone: TimeZone) => void;
  removeTimeZone: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setSelectedTimeZone: (timeZone: TimeZone | null) => void;
  toggleMap: () => void;
  updateCurrentTime: () => void;
}

// Default timezones for initial setup
const defaultTimeZones: TimeZone[] = [
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
];

export const useClockStore = create<ClockState>()(
  persist(
    (set, get) => ({
      currentTime: new Date(),
      timeZones: defaultTimeZones,
      selectedTimeZone: null,
      showMap: false,

      addTimeZone: (timeZone) => {
        // Check if timezone already exists
        const exists = get().timeZones.some(tz => tz.timezone === timeZone.timezone);
        if (!exists) {
          set(state => ({
            timeZones: [...state.timeZones, timeZone]
          }));
        }
      },

      removeTimeZone: (id) => {
        set(state => ({
          timeZones: state.timeZones.filter(tz => tz.id !== id)
        }));
      },

      toggleFavorite: (id) => {
        set(state => ({
          timeZones: state.timeZones.map(tz => 
            tz.id === id ? { ...tz, favorite: !tz.favorite } : tz
          )
        }));
      },

      setSelectedTimeZone: (timeZone) => {
        set({ selectedTimeZone: timeZone });
      },

      toggleMap: () => {
        set(state => ({ showMap: !state.showMap }));
      },

      updateCurrentTime: () => {
        set({ currentTime: new Date() });
      }
    }),
    {
      name: 'world-clock-storage',
      partialize: (state) => ({ 
        timeZones: state.timeZones,
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