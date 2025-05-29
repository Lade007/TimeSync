import { TimeZone } from '../store/clockStore';
import { formatInTimeZone } from 'date-fns-tz';
import { format } from 'date-fns';

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

// Add a helper function to determine if it's daytime in a given timezone
export const isDaytimeInTimeZone = (date: Date, timeZone: string): boolean => {
  try {
    const hour = parseInt(new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', hourCycle: 'h23' }).format(date));
    // Consider hours between 6 (inclusive) and 18 (exclusive) as daytime
    return hour >= 6 && hour < 18;
  } catch (error) {
    console.error('Error determining daytime for timezone:', error);
    // Default to true or false, or handle as an unknown state
    // For simplicity, we'll return true
    return true;
  }
};

// Haversine formula to calculate distance between two lat/lng points in kilometers
function getDistance(coords1: [number, number], coords2: [number, number]): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (coords2[0] - coords1[0]) * Math.PI / 180;
  const dLng = (coords2[1] - coords1[1]) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coords1[0] * Math.PI / 180) *
    Math.cos(coords2[0] * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

// Find the closest timezone to a given coordinate from a list of timezones
export function findClosestTimeZone(
  coordinates: [number, number],
  timezones: TimeZone[]
): TimeZone | null {
  if (!timezones || timezones.length === 0) {
    return null;
  }

  let closestTimeZone: TimeZone | null = null;
  let minDistance = Infinity;

  for (const timezone of timezones) {
    if (timezone.coordinates && timezone.coordinates.length === 2) {
      const distance = getDistance(coordinates, timezone.coordinates);
      if (distance < minDistance) {
        minDistance = distance;
        closestTimeZone = timezone;
      }
    }
  }

  return closestTimeZone;
}

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