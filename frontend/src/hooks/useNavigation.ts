import { useState, useEffect } from 'react';
import API_ENDPOINTS from '../config/api';
import { navigationAPI, type NavigationItem } from '../services/api';

// Re-export the interface from api service
export type { NavigationItem };

// Fallback данные
const fallbackData: NavigationItem[] = [
  {
    id: 1,
    title: 'Главная',
    url: '/',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Продукция',
    url: '/products',
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Видео-презентации',
    url: '/videos',
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Реквизиты',
    url: '/requisites',
    sort_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useNavigation = () => {
  const [navigation, setNavigation] = useState<NavigationItem[]>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        setLoading(true);
        // Add cache busting to ensure fresh data
        const response = await fetch(API_ENDPOINTS.NAVIGATION + '?' + Date.now(), {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setNavigation(data.data);
            setError(null);
          } else {
            throw new Error('Failed to fetch navigation data');
          }
        } else {
          throw new Error('Failed to fetch navigation data');
        }
      } catch (err) {
        setError('Failed to fetch navigation data');
        console.error('Error fetching navigation:', err);
        // Use fallback data on error
        setNavigation(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchNavigation();
  }, []);

  return { navigation, loading, error };
};
