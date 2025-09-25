import { useState, useEffect } from 'react';
import axios from 'axios';

export interface AboutItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AboutResponse {
  success: boolean;
  data: AboutItem[];
}

const fallbackData: AboutItem[] = [
  {
    id: 1,
    title: 'Кольцевая топология шлейфов',
    description: 'Отказоустойчивость. При обрыве или коротком замыкании шлейф делится на два рабочих радиальных. Система продолжает работать.',
    image_url: '/images/placeholders/placeholder-about-1.png',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Изоляторы короткого замыкания (ИКЗ)',
    description: 'Встроенные в устройства ИКЗ автоматически изолируют поврежденный участок, сохраняя работоспособность остальной части шлейфа.',
    image_url: '/images/placeholders/placeholder-about-2.png',
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Цифровой протокол M105',
    description: 'Цифровая связь с устройствами. До 199 извещателей и 20 модулей управления на один шлейф. Полный контроль состояния каждого устройства.',
    image_url: '/images/placeholders/placeholder-about-3.png',
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Сеть MasterNet',
    description: 'Объедините до 32 панелей в единую кольцевую сеть с автоматическим обходом обрывов. Защита объектов с неограниченной площадью.',
    image_url: '/images/placeholders/placeholder-about-4.png',
    sort_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useAbout = () => {
  const [aboutItems, setAboutItems] = useState<AboutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get<AboutResponse>('/api/about');
        
        if (response.data.success) {
          setAboutItems(response.data.data);
        } else {
          throw new Error('Failed to fetch about items');
        }
      } catch (err) {
        console.error('Error fetching about items:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Use fallback data in case of error
        setAboutItems(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutItems();
  }, []);

  return {
    aboutItems,
    loading,
    error
  };
};
