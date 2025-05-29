import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { TimeZone, useClockStore } from '../../store/clockStore';

const AddTimeZone: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TimeZone[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { allTimezonesData, addedTimeZones, addUserTimeZone } = useClockStore();

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery.length >= 2) {
      const lowerCaseQuery = debouncedSearchQuery.toLowerCase();
      // Filter from the comprehensive list
      const results = allTimezonesData.filter(tz =>
        tz.city.toLowerCase().includes(lowerCaseQuery) ||
        tz.country.toLowerCase().includes(lowerCaseQuery) ||
        tz.timezone.toLowerCase().includes(lowerCaseQuery)
      );
      // Filter out already added time zones from the results
      const filteredResults = results.filter(result =>
        !addedTimeZones.some(addedTz => addedTz.timezone === result.timezone)
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery, allTimezonesData, addedTimeZones]);

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
      // Use the existing ID from the timezone data
    };
    
    addUserTimeZone(newTimeZone);
    setSearchQuery('');
    setIsOpen(false);
  };

  const displayedResults = searchResults;

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-600 dark:text-gray-300" />
        </div>
        <input
          type="text"
          className="input pl-10 pr-10 w-full"
          placeholder="Search for a city or country..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true); // Always open dropdown on change
          }}
          onFocus={() => {
            setIsOpen(true); // Always open dropdown on focus
          }}
          onBlur={() => {
            // Delay closing to allow click on results
            setTimeout(() => setIsOpen(false), 100);
          }}
        />
        {searchQuery && (
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => {
              setSearchQuery('');
              setIsOpen(false);
            }}
            aria-label="Clear search query"
          >
            <X size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>

      {isOpen && displayedResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md max-h-60 overflow-y-auto animate-slide-up">
          <ul className="py-1">
            {displayedResults.map((result) => (
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

      {isOpen && searchQuery.length >= 2 && displayedResults.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md p-4 text-center animate-slide-up">
          <p className="text-gray-600 dark:text-gray-400">No matching cities found</p>
        </div>
      )}

      {isOpen && searchQuery.length < 2 && displayedResults.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md p-4 text-center animate-slide-up">
          <p className="text-gray-600 dark:text-gray-400">No popular timezones available.</p>
        </div>
      )}
    </div>
  );
};

export default AddTimeZone;