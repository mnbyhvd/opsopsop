import { useState, useEffect } from 'react';
import { apiService, type AboutItem } from '../services/api';

// Re-export the interface from api service
export type { AboutItem };

// Fallback данные
const fallbackData: AboutItem[] = [
  {
    id: 1,
    title: "Кольцевая топология шлейфов",
    description: "Отказоустойчивость. При обрыве или коротком замыкании шлейф делится на два рабочих радиальных. Система продолжает работать.",
    image_url: "/placeholder-about-1.png",
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Изоляторы короткого замыкания (ИКЗ)",
    description: "Встроенные в устройства ИКЗ автоматически изолируют поврежденный участок, сохраняя работоспособность остальной части шлейфа.",
    image_url: "/placeholder-about-2.png",
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Цифровой протокол M105",
    description: "Цифровая связь с устройствами. До 199 извещателей и 20 модулей управления на один шлейф. Полный контроль состояния каждого устройства.",
    image_url: "/placeholder-about-3.png",
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    title: "Сеть MasterNet",
    description: "Объедините до 32 панелей в единую кольцевую сеть с автоматическим обходом обрывов. Защита объектов с неограниченной площадью.",
    image_url: "/placeholder-about-4.png",
    sort_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useAbout = () => {
  const [aboutItems, setAboutItems] = useState<AboutItem[]>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutItems = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAboutItems();
        if (response.success) {
          console.log('Raw API data:', response.data);
          // Сортируем данные по sort_order
          const sortedData = response.data.sort((a, b) => a.sort_order - b.sort_order);
          console.log('Sorted data:', sortedData);
          console.log('First element:', sortedData[0]);
          console.log('All elements with sort_order:', sortedData.map(item => ({ id: item.id, title: item.title, sort_order: item.sort_order })));
          setAboutItems(sortedData);
          setError(null);
        } else {
          throw new Error('Failed to fetch about section data');
        }
      } catch (err) {
        setError('Failed to fetch about section data');
        console.error('Error fetching about items:', err);
        // Use fallback data on error
        setAboutItems(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutItems();
  }, []);

  return { aboutItems, loading, error };
};
