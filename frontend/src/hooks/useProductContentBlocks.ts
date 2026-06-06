import { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { ProductContentBlock } from '../types';

export const useProductContentBlocks = () => {
  const [blocks, setBlocks] = useState<ProductContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProductContentBlocks();
        if (response.success && Array.isArray(response.data)) {
          setBlocks((response.data as ProductContentBlock[]).sort((a, b) => a.sort_order - b.sort_order));
          setError(null);
        } else {
          throw new Error(response.error || 'Failed to fetch product content blocks');
        }
      } catch (err) {
        console.error('Error fetching product content blocks:', err);
        setBlocks([]);
        setError(err instanceof Error ? err.message : 'Failed to fetch product content blocks');
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, []);

  return { blocks, loading, error };
};
