import { useEffect, useMemo, useState } from 'react';
import { apiService } from '../services/apiService';
import { PageMeta } from '../types';
import { getPageMetaDefaults, PageMetaDefaults } from '../utils/pageMetaDefaults';

export const usePageMeta = (pageKey: string): PageMetaDefaults => {
  const fallback = useMemo(() => getPageMetaDefaults(pageKey), [pageKey]);
  const [meta, setMeta] = useState<PageMetaDefaults | null>(fallback || null);

  useEffect(() => {
    if (!pageKey) return;

    let isMounted = true;

    const fetchMeta = async () => {
      const response = await apiService.getPageMeta(pageKey);
      if (!isMounted) return;

      if (response.success && response.data) {
        const data = response.data as PageMeta;
        setMeta({
          page_key: data.page_key,
          path: data.path,
          label: data.label,
          title: data.title,
          description: data.description,
          sort_order: data.sort_order
        });
      } else if (fallback) {
        setMeta(fallback);
      }
    };

    fetchMeta();

    return () => {
      isMounted = false;
    };
  }, [fallback, pageKey]);

  return meta || fallback || {
    page_key: pageKey,
    path: '/',
    label: pageKey,
    title: 'СПС МАСТЕР',
    description: 'Системы пожарной сигнализации СПС МАСТЕР.',
    sort_order: 999
  };
};
