import { useState, useEffect } from 'react';

interface User {
  username: string;
  isAuthenticated: boolean;
}

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'MasterSPS2024!'
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем, есть ли сохраненная сессия
    const savedUser = localStorage.getItem('admin_user');
    console.log('Saved user from localStorage:', savedUser);
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('Parsed user data:', userData);
        setUser(userData);
      } catch (error) {
        console.log('Error parsing saved user:', error);
        localStorage.removeItem('admin_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const userData = { username, isAuthenticated: true };
      setUser(userData);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: user?.isAuthenticated || false
  };
};
