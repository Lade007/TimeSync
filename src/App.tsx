import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import WorldClockView from './components/world-clock/WorldClockView';
import TimersView from './components/timers/TimersView';
import WorldMap from './components/world-clock/WorldMap';
import { useClockStore } from './store/clockStore';

function App() {
  const [activeTab, setActiveTab] = useState('world-clock');
  const { showMap } = useClockStore();
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + 1-3 for tabs
      if (e.altKey) {
        switch (e.key) {
          case '1':
            setActiveTab('world-clock');
            break;
          case '2':
            setActiveTab('timers');
            break;
          case '3':
            setActiveTab('map');
            break;
          default:
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-grow main-content">
        {activeTab === 'world-clock' && (
          <>
            <WorldClockView />
            {showMap && <WorldMap />}
          </>
        )}
        
        {activeTab === 'timers' && <TimersView />}
        
        {activeTab === 'map' && <WorldMap />}
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>TimeSync - World Clock App &copy; {new Date().getFullYear()}</p>
          <p className="text-xs mt-1">
            Keyboard shortcuts: Alt+1 (World Clock), Alt+2 (Timers), Alt+3 (Map)
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;