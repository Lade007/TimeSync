import { TimeZone } from '../store/clockStore';

// Simplified timezone database for demo purposes
export const popularTimeZones: TimeZone[] = [
  {
    id: 'new-york',
    name: 'New York',
    city: 'New York',
    country: 'United States',
    timezone: 'America/New_York',
    offset: 'UTC-5',
    coordinates: [-74.006, 40.7128],
    favorite: false,
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    city: 'Los Angeles',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    offset: 'UTC-8',
    coordinates: [-118.2437, 34.0522],
    favorite: false,
  },
  {
    id: 'london',
    name: 'London',
    city: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    offset: 'UTC+0',
    coordinates: [-0.1278, 51.5074],
    favorite: false,
  },
  {
    id: 'paris',
    name: 'Paris',
    city: 'Paris',
    country: 'France',
    timezone: 'Europe/Paris',
    offset: 'UTC+1',
    coordinates: [2.3522, 48.8566],
    favorite: false,
  },
  {
    id: 'berlin',
    name: 'Berlin',
    city: 'Berlin',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    offset: 'UTC+1',
    coordinates: [13.4050, 52.5200],
    favorite: false,
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    offset: 'UTC+9',
    coordinates: [139.6503, 35.6762],
    favorite: false,
  },
  {
    id: 'sydney',
    name: 'Sydney',
    city: 'Sydney',
    country: 'Australia',
    timezone: 'Australia/Sydney',
    offset: 'UTC+10',
    coordinates: [151.2093, -33.8688],
    favorite: false,
  },
  {
    id: 'auckland',
    name: 'Auckland',
    city: 'Auckland',
    country: 'New Zealand',
    timezone: 'Pacific/Auckland',
    offset: 'UTC+12',
    coordinates: [174.7633, -36.8485],
    favorite: false,
  },
  {
    id: 'dubai',
    name: 'Dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    timezone: 'Asia/Dubai',
    offset: 'UTC+4',
    coordinates: [55.2708, 25.2048],
    favorite: false,
  },
  {
    id: 'singapore',
    name: 'Singapore',
    city: 'Singapore',
    country: 'Singapore',
    timezone: 'Asia/Singapore',
    offset: 'UTC+8',
    coordinates: [103.8198, 1.3521],
    favorite: false,
  },
  {
    id: 'rio',
    name: 'Rio de Janeiro',
    city: 'Rio de Janeiro',
    country: 'Brazil',
    timezone: 'America/Sao_Paulo',
    offset: 'UTC-3',
    coordinates: [-43.1729, -22.9068],
    favorite: false,
  },
  {
    id: 'johannesburg',
    name: 'Johannesburg',
    city: 'Johannesburg',
    country: 'South Africa',
    timezone: 'Africa/Johannesburg',
    offset: 'UTC+2',
    coordinates: [28.0473, -26.2041],
    favorite: false,
  },
];

// Calculate time difference between two timezones
export const getTimeDifference = (timezone1: string, timezone2: string): number => {
  const date = new Date();
  
  const options1 = { timeZone: timezone1, hour: 'numeric' as const };
  const options2 = { timeZone: timezone2, hour: 'numeric' as const };
  
  const hour1 = parseInt(new Intl.DateTimeFormat('en-US', options1).format(date));
  const hour2 = parseInt(new Intl.DateTimeFormat('en-US', options2).format(date));
  
  // Handle day boundary cases
  let diff = hour2 - hour1;
  if (diff > 12) diff -= 24;
  if (diff < -12) diff += 24;
  
  return diff;
};

// Format time difference as string
export const formatTimeDifference = (diffHours: number): string => {
  if (diffHours === 0) return 'Same time';
  
  const absHours = Math.abs(diffHours);
  const ahead = diffHours > 0;
  
  return ahead
    ? `${absHours} hour${absHours !== 1 ? 's' : ''} ahead`
    : `${absHours} hour${absHours !== 1 ? 's' : ''} behind`;
};

// Get user's local timezone
export const getLocalTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Filter timezones by search query
export const searchTimeZones = (query: string): TimeZone[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) return [];
  
  return popularTimeZones.filter(tz => 
    tz.city.toLowerCase().includes(normalizedQuery) ||
    tz.country.toLowerCase().includes(normalizedQuery) ||
    tz.name.toLowerCase().includes(normalizedQuery)
  );
};

// Generate a unique ID for a new timezone
export const generateTimeZoneId = (): string => {
  return Date.now().toString();
};