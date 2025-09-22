import { useState, useEffect } from 'react';
import { footerAPI, type FooterItem } from '../services/api';

// Re-export the interface from api service
export type { FooterItem };

export interface FooterData {
  navigation: FooterItem[];
  contacts: FooterItem[];
  legal: FooterItem[];
  social: FooterItem[];
}

// Fallback данные
const fallbackData: FooterData = {
  navigation: [
    {
      id: 1,
      section_type: 'navigation',
      title: 'Главная',
      url: '/',
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      section_type: 'navigation',
      title: 'О системе',
      url: '/about',
      sort_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  contacts: [
    {
      id: 3,
      section_type: 'contacts',
      title: 'Телефон',
      content: '+7 (XXX) XXX-XX-XX',
      url: 'tel:+7XXXXXXXXXX',
      icon: 'phone',
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  legal: [
    {
      id: 4,
      section_type: 'legal',
      title: '© 2024 АПС МАСТЕР. Все права защищены.',
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  social: []
};

export const useFooter = () => {
  const [footerData, setFooterData] = useState<FooterData>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setLoading(true);
        const response = await footerAPI.getItems();
        if (response.success) {
          // Group footer data by section type
          const grouped = response.data.reduce((acc: FooterData, item: FooterItem) => {
            if (!acc[item.section_type as keyof FooterData]) {
              acc[item.section_type as keyof FooterData] = [];
            }
            acc[item.section_type as keyof FooterData].push(item);
            return acc;
          }, {
            navigation: [],
            contacts: [],
            legal: [],
            social: []
          });
          setFooterData(grouped);
          setError(null);
        } else {
          throw new Error('Failed to fetch footer data');
        }
      } catch (err) {
        setError('Failed to fetch footer data');
        console.error('Error fetching footer data:', err);
        // Use fallback data on error
        setFooterData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  return { footerData, loading, error };
};
