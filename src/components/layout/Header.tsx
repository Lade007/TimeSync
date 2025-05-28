import React from 'react';
import { Clock, MapPin, Timer, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface HeaderProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { theme, toggleTheme } = useTheme();
  
  const navItems: NavItem[] = [
    { id: 'world-clock', label: 'World Clock', icon: <Clock size={18} /> },
    { id: 'timers', label: 'Timers', icon: <Timer size={18} /> },
    { id: 'map', label: 'Map View', icon: <MapPin size={18} /> },
  ];
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10 sticky top-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Clock className="text-primary-500" size={24} />
            <span className="font-bold text-xl tracking-tight">TimeSync</span>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            <div className="tabs">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`tab flex items-center space-x-1.5 ${
                    activeTab === item.id ? 'tab-active' : 'tab-inactive'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
          
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="btn btn-secondary rounded-full p-2 flex items-center justify-center"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="tabs w-full">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`tab flex items-center justify-center flex-1 ${
                  activeTab === item.id ? 'tab-active' : 'tab-inactive'
                }`}
              >
                <div className="flex flex-col items-center">
                  {item.icon}
                  <span className="text-xs mt-1">{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;