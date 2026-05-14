import { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { ServiceBlock } from '../types';

const fallbackServices: ServiceBlock[] = [
  {
    id: 1,
    title: 'Проектирование систем противопожарной безопасности',
    description: 'Анализ объекта, разработка рабочей документации и подбор технических решений для систем пожарной сигнализации, оповещения и управления эвакуацией.',
    image_url: '/images/placeholders/placeholder-about-1.png',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Монтаж систем пожарной сигнализации',
    description: 'Полный комплекс монтажных работ: прокладка трасс, установка оборудования, подключение и подготовка систем к пусконаладке.',
    image_url: '/images/placeholders/placeholder-about-2.png',
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Техническое обслуживание систем пожарной безопасности',
    description: 'Плановое обслуживание, диагностика, проверка работоспособности и документирование состояния систем на объекте.',
    image_url: '/images/placeholders/placeholder-about-3.png',
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useServices = () => {
  const [services, setServices] = useState<ServiceBlock[]>(fallbackServices);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await apiService.getServices();
        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch services');
        }

        const data = (response.data as ServiceBlock[]).sort((a, b) => a.sort_order - b.sort_order);
        setServices(data.length > 0 ? data : fallbackServices);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading, error };
};
