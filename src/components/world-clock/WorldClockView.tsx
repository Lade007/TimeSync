import React, { useEffect } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { useClockStore } from '../../store/clockStore';
import ClockCard from './ClockCard';
import AddTimeZone from './AddTimeZone';
import { getLocalTimeZone } from '../../utils/timeZoneUtils';
import LocalDigitalClock from './LocalDigitalClock';

const WorldClockView: React.FC = () => {
  const { addedTimeZones, currentTime, updateCurrentTime, toggleMap } = useClockStore();
  
  // Update time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateCurrentTime();
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [updateCurrentTime]);

  // Make sure we have the local timezone
  useEffect(() => {
    const localTz = getLocalTimeZone();
    const hasLocalTimeZone = addedTimeZones.some(tz => tz.timezone === localTz);
    
    if (!hasLocalTimeZone && localTz) {
      // This is just a placeholder - in a real app we would have a
      // complete timezone database to look up the proper info
    }
  }, [addedTimeZones]);

  // Sort timezones: favorites first, then alphabetical
  const sortedTimeZones = [...addedTimeZones].sort((a, b) => {
    if (a.favorite === b.favorite) {
      return a.city.localeCompare(b.city);
    }
    return a.favorite ? -1 : 1;
  });

  return (
    <div className="section">
      <div className="mb-6">
        <AddTimeZone />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Clocks</h2>
        <button 
          onClick={toggleMap}
          className="btn btn-secondary flex items-center gap-2"
        >
          <MapPin size={16} />
          <span>Map View</span>
        </button>
      </div>

      <LocalDigitalClock />

      {/* Display all clocks from addedTimeZones */}
      {addedTimeZones.length === 0 ? (
        <div className="clock-card flex flex-col items-center justify-center py-10">
          <Clock size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            No clocks added yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
            Search for a city above to add your first clock. Track times around the world at a glance.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTimeZones.map(timeZone => (
            <ClockCard 
              key={timeZone.id} 
              timeZone={timeZone} 
              currentTime={currentTime} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorldClockView;