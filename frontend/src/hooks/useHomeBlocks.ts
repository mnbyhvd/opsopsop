import { useCallback, useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { HomeBlock } from '../types';
import { buildHomeBlockState, defaultHomeBlockState, HomeBlockKey, HomeBlockState } from '../utils/homeBlocks';

export const useHomeBlocks = () => {
  const [blocks, setBlocks] = useState<HomeBlockState>(defaultHomeBlockState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlocks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getHomeBlocks();

      if (response.success && Array.isArray(response.data)) {
        setBlocks(buildHomeBlockState(response.data as HomeBlock[]));
        setError(null);
      } else {
        throw new Error(response.error || 'Failed to fetch homepage blocks');
      }
    } catch (err) {
      console.error('Error fetching homepage blocks:', err);
      setBlocks(defaultHomeBlockState);
      setError(err instanceof Error ? err.message : 'Failed to fetch homepage blocks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const isEnabled = useCallback((key: HomeBlockKey) => blocks[key] !== false, [blocks]);

  return {
    blocks,
    loading,
    error,
    isEnabled,
    refetch: fetchBlocks
  };
};
