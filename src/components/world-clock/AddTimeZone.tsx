import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { TimeZone, useClockStore } from '../../store/clockStore';
import { searchTimeZones, generateTimeZoneId } from '../../utils/timeZoneUtils';

const AddTimeZone: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TimeZone[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { addTimeZone, timeZones } = useClockStore();

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = searchTimeZones(searchQuery);
      // Filter out already added time zones
      const filteredResults = results.filter(
        result => !timeZones.some(tz => tz.timezone === result.timezone)
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, timeZones]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddTimeZone = (tz: TimeZone) => {
    const newTimeZone = {
      ...tz,
      id: generateTimeZoneId()
    };
    
    addTimeZone(newTimeZone);
    setSearchQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-500" />
        </div>
        <input
          type="text"
          className="input pl-10 pr-10 w-full"
          placeholder="Search for a city or country..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.length >= 2) setIsOpen(true);
          }}
          onFocus={() => {
            if (searchQuery.length >= 2) setIsOpen(true);
          }}
        />
        {searchQuery && (
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => {
              setSearchQuery('');
              setIsOpen(false);
            }}
          >
            <X size={18} className="text-gray-500" />
          </button>
        )}
      </div>

      {isOpen && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md max-h-60 overflow-y-auto animate-slide-up">
          <ul className="py-1">
            {searchResults.map((result) => (
              <li key={result.id} className="px-2">
                <button
                  className="flex justify-between items-center w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => handleAddTimeZone(result)}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {result.city}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {result.country} • {result.timezone}
                    </p>
                  </div>
                  <Plus size={16} className="text-primary-500" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen && searchQuery.length >= 2 && searchResults.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md p-4 text-center animate-slide-up">
          <p className="text-gray-600 dark:text-gray-400">No matching cities found</p>
        </div>
      )}
    </div>
  );
};

export default AddTimeZone;