
import React from 'react';
import { Screen } from '../types.ts';
import { HomeIcon, HeartIcon, SettingsIcon } from '../constants.tsx';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  const navItems = [
    { screen: Screen.Listings, label: 'Trang chủ', icon: HomeIcon },
    { screen: Screen.Saved, label: 'Đã lưu', icon: HeartIcon },
    { screen: Screen.Settings, label: 'Cài đặt', icon: SettingsIcon },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-[0_-2px_5px_rgba(0,0,0,0.1)] dark:shadow-[0_-2px_5px_rgba(0,0,0,0.4)] flex justify-around items-center md:hidden z-40">
      {navItems.map(item => {
        const isActive = activeScreen === item.screen;
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onClick={() => setActiveScreen(item.screen)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
              isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;