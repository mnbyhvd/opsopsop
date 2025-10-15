import { useState, useEffect, useCallback } from 'react';
import { Product, UseProductsReturn } from '../types';

interface UseProductsParams {
  categoryId?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

export const useProducts = (params?: UseProductsParams): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Строим URL с параметрами
      const url = new URL('/api/products', window.location.origin);
      if (params?.categoryId) url.searchParams.append('category_id', params.categoryId.toString());
      if (params?.search) url.searchParams.append('search', params.search);
      if (params?.limit) url.searchParams.append('limit', params.limit.toString());
      if (params?.offset) url.searchParams.append('offset', params.offset.toString());
      
      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setProducts(data.data);
          setError(null);
        } else {
          throw new Error('Failed to fetch products');
        }
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [params?.categoryId, params?.search, params?.limit, params?.offset]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};
