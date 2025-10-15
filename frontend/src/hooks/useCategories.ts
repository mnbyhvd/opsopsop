import { useState, useEffect } from 'react';
import { Category, UseCategoriesReturn } from '../types';

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories/used');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setCategories(data.data);
          setError(null);
        } else {
          throw new Error('Failed to fetch categories');
        }
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
};
