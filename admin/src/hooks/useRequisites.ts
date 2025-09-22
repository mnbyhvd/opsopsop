import { useState, useEffect, useCallback } from 'react';

export interface RequisitesData {
  id: number;
  company_name: string;
  legal_name: string;
  inn: string;
  kpp: string;
  ogrn: string;
  legal_address: string;
  actual_address: string;
  phone: string;
  email: string;
  website: string;
  bank_name: string;
  bank_account: string;
  correspondent_account: string;
  bik: string;
  director_name: string;
  director_position: string;
  created_at: string;
  updated_at: string;
}

export const useRequisites = () => {
  const [requisites, setRequisites] = useState<RequisitesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequisites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/requisites');
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки реквизитов');
      }

      const data = await response.json();
      
      if (data.success) {
        setRequisites(data.data);
      } else {
        throw new Error(data.error || 'Ошибка загрузки реквизитов');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('Error fetching requisites:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRequisites = useCallback(async (updatedData: Partial<RequisitesData>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/requisites/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Ошибка обновления реквизитов');
      }

      const data = await response.json();
      
      if (data.success) {
        setRequisites(data.data);
        return { success: true, data: data.data };
      } else {
        throw new Error(data.error || 'Ошибка обновления реквизитов');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('Error updating requisites:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequisites();
  }, [fetchRequisites]);

  return {
    requisites,
    loading,
    error,
    fetchRequisites,
    updateRequisites,
  };
};
