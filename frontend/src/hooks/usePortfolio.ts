import { useCallback, useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { PortfolioProject } from '../types';

const fallbackProjects: PortfolioProject[] = [
  {
    id: 1,
    title: 'Автоматическая пожарная сигнализация и СОУЭ',
    slug: 'aps-soue-moscow',
    location: 'Москва, Московский, Киевское шоссе, 22 км',
    summary: 'Полное оснащение объекта современными системами противопожарной защиты.',
    description: 'В рамках проекта выполнено полное оснащение объекта современными системами противопожарной защиты: разработана рабочая документация, смонтирована адресно-аналоговая система автоматической пожарной сигнализации на базе приборов «Мастер 1-2F1E», а также система оповещения и управления эвакуацией 2-го типа.',
    image_url: '/images/placeholders/placeholder-about-1.png',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const usePortfolioProjects = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiService.getPortfolioProjects();
        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch portfolio');
        }

        const data = (response.data as PortfolioProject[]).sort((a, b) => a.sort_order - b.sort_order);
        setProjects(data.length > 0 ? data : fallbackProjects);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch portfolio');
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
};

export const usePortfolioProject = (slug: string | undefined) => {
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!slug) {
      setProject(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.getPortfolioProject(slug);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch portfolio project');
      }

      setProject(response.data as PortfolioProject);
      setError(null);
    } catch (err) {
      const fallback = fallbackProjects.find(item => item.slug === slug) || null;
      setProject(fallback);
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio project');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return { project, loading, error, refetch: fetchProject };
};
