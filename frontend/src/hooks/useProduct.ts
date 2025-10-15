import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';

export const useProduct = (productId: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setProduct(data.data);
          setError(null);
        } else {
          throw new Error('Failed to fetch product');
        }
      } else {
        throw new Error('Failed to fetch product');
      }
    } catch (err) {
      setError('Failed to fetch product');
      console.error('Error fetching product:', err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, fetchProduct]);

  return { product, loading, error, refetch: fetchProduct };
};
