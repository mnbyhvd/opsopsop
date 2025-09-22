import { useState, useEffect } from 'react';

export interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const defaultVideos: Video[] = [
  {
    id: 1,
    title: 'Демонстрация системы МАСТЕР',
    description: 'Полная демонстрация возможностей системы МАСТЕР',
    video_url: '/videos/demo.mp4',
    thumbnail_url: '/videos/demo.gif',
    duration: '5:30',
    category: 'Демонстрации',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Установка и настройка',
    description: 'Пошаговая инструкция по установке и настройке системы',
    video_url: '/videos/installation.mp4',
    thumbnail_url: '/videos/installation.gif',
    duration: '3:45',
    category: 'Инструкции',
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Технические характеристики',
    description: 'Подробный обзор технических характеристик оборудования',
    video_url: '/videos/tech-specs.mp4',
    thumbnail_url: '/videos/tech-specs.gif',
    duration: '4:20',
    category: 'Техническая информация',
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Обслуживание и ремонт',
    description: 'Руководство по обслуживанию и ремонту оборудования',
    video_url: '/videos/maintenance.mp4',
    thumbnail_url: '/videos/maintenance.gif',
    duration: '6:15',
    category: 'Обслуживание',
    sort_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>(defaultVideos);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/videos');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setVideos(data.data);
            setError(null);
          } else {
            throw new Error('Failed to fetch videos');
          }
        } else {
          throw new Error('Failed to fetch videos');
        }
      } catch (err) {
        setError('Failed to fetch videos');
        console.error('Error fetching videos:', err);
        setVideos(defaultVideos); // Use default videos on error
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, loading, error };
};
