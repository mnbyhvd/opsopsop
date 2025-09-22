import { useState, useEffect } from 'react';
import { apiService, type TechnicalSpec } from '../services/api';

// Re-export the interface from api service
export type { TechnicalSpec };

// Fallback данные
const fallbackData: TechnicalSpec[] = [
  {
    id: 1,
    title: 'Кольцевых шлейфов',
    description: 'Максимальное количество кольцевых шлейфов в одной панели',
    value: '4',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Извещателей на шлейф',
    description: 'Максимальное количество извещателей на один шлейф',
    value: '199',
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Модулей управления',
    description: 'Максимальное количество модулей управления на шлейф',
    value: '1000',
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Панелей в сети',
    description: 'Максимальное количество панелей в сети MasterNet',
    value: '32',
    sort_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useTechnicalSpecs = () => {
  const [technicalSpecs, setTechnicalSpecs] = useState<TechnicalSpec[]>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnicalSpecs = async () => {
      try {
        setLoading(true);
        const response = await apiService.getTechnicalSpecs();
        if (response.success) {
          setTechnicalSpecs(response.data);
          setError(null);
        } else {
          throw new Error('Failed to fetch technical specs data');
        }
      } catch (err) {
        setError('Failed to fetch technical specs data');
        console.error('Error fetching technical specs:', err);
        // Use fallback data on error
        setTechnicalSpecs(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicalSpecs();
  }, []);

  return { technicalSpecs, loading, error };
};
