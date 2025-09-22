import { useState, useEffect } from 'react';
import axios from 'axios';

export interface NavigationItem {
  id: number;
  title: string;
  url: string;
  sort_order: number;
  parent_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface NavigationResponse {
  success: boolean;
  data: NavigationItem[];
}

const fallbackData: NavigationItem[] = [
  {
    id: 1,
    title: 'О системе',
    url: '/about',
    sort_order: 1,
    parent_id: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Продукция',
    url: '/products',
    sort_order: 2,
    parent_id: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Видео-презентации',
    url: '/videos',
    sort_order: 3,
    parent_id: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Документы',
    url: '/docs',
    sort_order: 4,
    parent_id: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useNavigation = () => {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNavigationItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get<NavigationResponse>('/api/navigation');
        
        if (response.data.success) {
          setNavigationItems(response.data.data);
        } else {
          throw new Error('Failed to fetch navigation items');
        }
      } catch (err) {
        console.error('Error fetching navigation items:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Use fallback data in case of error
        setNavigationItems(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchNavigationItems();
  }, []);

  return {
    navigationItems,
    loading,
    error
  };
};
