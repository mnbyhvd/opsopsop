import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

export interface AboutItem {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  section_group?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}


// Fallback данные
const fallbackData: Record<string, AboutItem[]> = {
  main: [
  {
    id: 1,
    title: "Кольцевая топология шлейфов",
    description: "Отказоустойчивость. При обрыве или коротком замыкании шлейф делится на два рабочих радиальных. Система продолжает работать.",
    image_url: "/images/placeholders/placeholder-about-1.png",
    section_group: "main",
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Изоляторы короткого замыкания (ИКЗ)",
    description: "Встроенные в устройства ИКЗ автоматически изолируют поврежденный участок, сохраняя работоспособность остальной части шлейфа.",
    image_url: "/images/placeholders/placeholder-about-2.png",
    section_group: "main",
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Цифровой протокол M105",
    description: "Цифровая связь с устройствами. До 199 извещателей и 20 модулей управления на один шлейф. Полный контроль состояния каждого устройства.",
    image_url: "/images/placeholders/placeholder-about-3.png",
    section_group: "main",
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    title: "Сеть MasterNet",
    description: "Объедините до 32 панелей в единую кольцевую сеть с автоматическим обходом обрывов. Защита объектов с неограниченной площадью.",
    image_url: "/images/placeholders/placeholder-about-4.png",
    section_group: "main",
    sort_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }],
  secondary: [
    {
      id: 101,
      title: "Единая среда проектирования",
      description: "Система подходит для объектов разного масштаба: от отдельных помещений до распределённых комплексов с несколькими панелями и сценариями оповещения.",
      image_url: "/images/placeholders/placeholder-about-1.png",
      section_group: "secondary",
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 102,
      title: "Интеграция с инженерными системами",
      description: "Оборудование связывает пожарную автоматику, оповещение, диспетчеризацию и исполнительные устройства в единую управляемую инфраструктуру.",
      image_url: "/images/placeholders/placeholder-about-2.png",
      section_group: "secondary",
      sort_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 103,
      title: "Контроль состояния оборудования",
      description: "Адресная архитектура помогает быстро находить события, неисправности и зоны срабатывания, сокращая время диагностики и обслуживания.",
      image_url: "/images/placeholders/placeholder-about-3.png",
      section_group: "secondary",
      sort_order: 3,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

export const useAbout = (group: string = 'main') => {
  const groupFallback = fallbackData[group] || fallbackData.main;
  const [aboutItems, setAboutItems] = useState<AboutItem[]>(groupFallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutItems = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAbout(group);
        if (response.success) {
          const sortedData = (response.data as AboutItem[]).sort((a, b) => a.sort_order - b.sort_order);
          setAboutItems(sortedData.length > 0 ? sortedData : groupFallback);
          setError(null);
        } else {
          throw new Error('Failed to fetch about section data');
        }
      } catch (err) {
        setError('Failed to fetch about section data');
        console.error('Error fetching about items:', err);
        // Use fallback data on error
        setAboutItems(groupFallback);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutItems();
  }, [group]);

  return { aboutItems, loading, error };
};
