
import React, { useState, useEffect, useCallback } from 'react';
import { Screen, UserInfo } from './types.ts';
import { useSavedApartments } from './hooks/useSavedApartments.ts'; 
import { useUserInfo } from './hooks/useUserInfo.ts';

import ListingsScreen from './screens/ListingsScreen.tsx';
import SavedScreen from './screens/SavedScreen.tsx';
import DetailScreen from './screens/DetailScreen.tsx';
import SettingsScreen from './screens/SettingsScreen.tsx';
import BottomNav from './components/BottomNav.tsx';
import LoginScreen from './screens/LoginScreen.tsx';
import Spinner from './components/Spinner.tsx';


const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Listings);
  const [selectedApartmentId, setSelectedApartmentId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const { userInfo, saveUserInfo, fetchUserInfo } = useUserInfo(token);
  const savedHook = useSavedApartments(token);


  useEffect(() => {
    // Check for token in local storage on initial load
    const storedToken = localStorage.getItem('userToken');
    if (storedToken) {
      setToken(storedToken);
    }
    setAuthLoading(false);

    // Dark mode logic
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mediaQuery.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  useEffect(() => {
    if (token) {
        fetchUserInfo();
        savedHook.fetchSavedIds();
    }
  }, [token]);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('userToken', newToken);
    setToken(newToken);
  };
  
  const handleLogout = useCallback(() => {
      localStorage.removeItem('userToken');
      setToken(null);
      // Reset states
      setActiveScreen(Screen.Listings);
      setSelectedApartmentId(null);
  }, []);

  const handleSelectApartment = (id: string) => {
    setSelectedApartmentId(id);
  };

  const handleBack = () => {
    if (selectedApartmentId) {
      setSelectedApartmentId(null);
    } else {
      setActiveScreen(Screen.Listings);
    }
  };

  const renderContent = () => {
    if (authLoading) {
        return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
    }
    
    if (!token) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    if (selectedApartmentId) {
      return (
        <DetailScreen
          apartmentId={selectedApartmentId}
          onBack={handleBack}
          savedHook={savedHook}
        />
      );
    }

    switch (activeScreen) {
      case Screen.Listings:
        return (
          <ListingsScreen
            onSelectApartment={handleSelectApartment}
            savedHook={savedHook}
          />
        );
      case Screen.Saved:
        return (
          <SavedScreen
            onSelectApartment={handleSelectApartment}
            savedHook={savedHook}
            onBack={handleBack}
          />
        );
      case Screen.Settings:
        return <SettingsScreen onBack={handleBack} onLogout={handleLogout} userInfo={userInfo} saveUserInfo={saveUserInfo} />;
      default:
        return null;
    }
  };

  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto pb-20 md:pb-0">
        {renderContent()}
      </div>
      {token && !selectedApartmentId && (
        <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      )}
    </div>
  );
};

export default App;
