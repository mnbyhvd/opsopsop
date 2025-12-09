import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

export interface NavigationItem {
  id: number;
  title: string;
  url: string;
  sort_order: number;
  parent_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Fallback данные
const fallbackData: NavigationItem[] = [
  {
    id: 2,
    title: 'Продукция',
    url: '/products',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Видео-презентации',
    url: '/videos',
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Реквизиты',
    url: '/requisites',
    sort_order: 3,
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
        const response = await apiService.getNavigation();
        
        if (response.success) {
          setNavigation(response.data as NavigationItem[]);
          setError(null);
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
