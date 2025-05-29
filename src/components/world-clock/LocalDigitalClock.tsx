import React, { useState, useEffect } from 'react';

const LocalDigitalClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="text-center mb-8">
      <p className="text-6xl font-mono font-bold text-gray-900 dark:text-white mb-2">
        {formattedTime}
      </p>
      <p className="text-xl text-gray-600 dark:text-gray-400">
        {formattedDate}
      </p>
    </div>
  );
};

export default LocalDigitalClock; 