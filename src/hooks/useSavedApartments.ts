
import { useState, useCallback, useEffect } from 'react';
// const API_URL = 'http://localhost:5000/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE}/api`;


export const useSavedApartments = (token: string | null) => {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  
  const fetchSavedIds = useCallback(async () => {
      if (!token) return;
      try {
          const response = await fetch(`${API_URL}/users/me`, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
          if (!response.ok) throw new Error('Failed to fetch user data');
          const data = await response.json();
          setSavedIds(data.savedApartments || []);
      } catch (error) {
          console.error('Failed to retrieve saved apartments from API', error);
          setSavedIds([]);
      }
  }, [token]);

  const toggleSavedApartment = useCallback(async (apartmentId: string) => {
    if (!token) return;
    
    const isCurrentlySaved = savedIds.includes(apartmentId);
    
    // Optimistic update
    const newSavedIds = isCurrentlySaved 
      ? savedIds.filter(id => id !== apartmentId)
      : [...savedIds, apartmentId];
    setSavedIds(newSavedIds);

    try {
        const response = await fetch(`${API_URL}/users/me/saved`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ apartmentId })
        });

        if (!response.ok) {
            // Revert on failure
            setSavedIds(savedIds);
            throw new Error('Failed to update saved apartments');
        }
        const data = await response.json();
        setSavedIds(data.savedApartments); // Sync with server response

    } catch (error) {
        console.error('Failed to toggle saved apartment', error);
        // Revert on failure
        setSavedIds(savedIds);
    }
  }, [token, savedIds]);

  const isSaved = useCallback((id: string) => {
    return savedIds.includes(id);
  }, [savedIds]);
  

  return { savedIds, toggleSavedApartment, isSaved, fetchSavedIds };
};
