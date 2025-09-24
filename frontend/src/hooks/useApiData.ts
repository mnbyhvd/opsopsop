import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';

interface UseApiDataOptions<T> {
  apiCall: () => Promise<{ success: boolean; data?: T; error?: string }>;
  fallbackData: T;
  dependencies?: any[];
}

export function useApiData<T>({
  apiCall,
  fallbackData,
  dependencies = []
}: UseApiDataOptions<T>) {
  const [data, setData] = useState<T>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall();
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData(fallbackData); // Use fallback data on error
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
