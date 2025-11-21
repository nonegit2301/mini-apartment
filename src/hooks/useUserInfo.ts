
import { useState, useCallback } from 'react';
import type { UserInfo } from '../types.ts';

// const API_URL = 'http://localhost:5000/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE}/api`;


export const useUserInfo = (token: string | null) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', email: '', phone: '' });

  const fetchUserInfo = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch user info');
      const data = await res.json();
      setUserInfo({ name: data.name, email: data.email, phone: data.phone });
    } catch (error) {
      console.error('Failed to retrieve user info from API', error);
    }
  }, [token]);


  const saveUserInfo = useCallback(async (newInfo: UserInfo) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newInfo),
      });
       if (!res.ok) throw new Error('Failed to save user info');
       const data = await res.json();
       setUserInfo({ name: data.name, email: data.email, phone: data.phone });
    } catch (error) {
      console.error('Failed to save user info to API', error);
    }
  }, [token]);

  return { userInfo, saveUserInfo, fetchUserInfo };
};
