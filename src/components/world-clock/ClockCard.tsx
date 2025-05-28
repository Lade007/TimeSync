import React, { useState } from 'react';
import { Heart, Trash2, MoreHorizontal, Sun, Moon } from 'lucide-react';
import { TimeZone, formatTimeForTimeZone, formatDateForTimeZone, useClockStore } from '../../store/clockStore';
import { getTimeDifference, formatTimeDifference, getLocalTimeZone, isDaytimeInTimeZone } from '../../utils/timeZoneUtils';
import { formatInTimeZone } from 'date-fns-tz';

interface ClockCardProps {
  timeZone: TimeZone;
  currentTime: Date;
}

const ClockCard: React.FC<ClockCardProps> = ({ timeZone, currentTime }) => {
  const [show24Hour, setShow24Hour] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { toggleFavorite, removeTimeZone } = useClockStore();
  
  const toggleTimeFormat = () => setShow24Hour(!show24Hour);
  const toggleMenu = () => setShowMenu(!showMenu);
  
  const formattedTime = formatTimeForTimeZone(currentTime, timeZone.timezone, show24Hour);
  const formattedDate = formatDateForTimeZone(currentTime, timeZone.timezone);
  
  // Calculate time difference with local time
  const localTimeZone = getLocalTimeZone();
  const timeDiff = getTimeDifference(localTimeZone, timeZone.timezone);
  const timeDiffFormatted = formatTimeDifference(timeDiff);
  const isLocal = localTimeZone === timeZone.timezone;
  
  const isDaytime = isDaytimeInTimeZone(currentTime, timeZone.timezone);
  
  return (
    <div className={`clock-card animate-fade-in hover:shadow-lg ${timeZone.favorite ? 'border-accent-500 border-2' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            {timeZone.city}
            {isLocal && <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-0.5 rounded-full">Local</span>}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{timeZone.country}</p>
        </div>
        <div className="relative">
          <button 
            onClick={toggleMenu}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="More options"
          >
            <MoreHorizontal size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 py-1 animate-slide-up">
              <button
                onClick={() => {
                  toggleFavorite(timeZone.id);
                  setShowMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <Heart size={16} className={`mr-2 ${timeZone.favorite ? 'fill-accent-500 text-accent-500' : ''}`} />
                {timeZone.favorite ? 'Remove from favorites' : 'Add to favorites'}
              </button>
              <button
                onClick={() => {
                  toggleTimeFormat();
                  setShowMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                Toggle 24-hour format
              </button>
              <button
                onClick={() => {
                  removeTimeZone(timeZone.id);
                  setShowMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <Trash2 size={16} className="mr-2" />
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center my-6">
        <p className="text-3xl font-mono font-semibold text-gray-900 dark:text-white flex items-center justify-center">
          {formattedTime}
          {isDaytime ? (
            <Sun size={24} className="ml-2 text-warning-500" />
          ) : (
            <Moon size={24} className="ml-2 text-gray-500" />
          )}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{formattedDate}</p>
        <p className="text-xs mt-2 text-gray-500 dark:text-gray-500">
          {isLocal ? 'Your local time' : `${timeDiffFormatted} your local time`}
        </p>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex justify-between items-center">
        <span>{timeZone.timezone}</span>
        <span>{formatInTimeZone(currentTime, timeZone.timezone, '(xxx)')}</span>
      </div>
    </div>
  );
};

export default ClockCard;