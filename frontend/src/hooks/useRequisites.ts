import { useState, useEffect } from 'react';

interface RequisitesData {
  id: number;
  company_name: string | null;
  legal_name: string | null;
  inn: string | null;
  kpp: string | null;
  ogrn: string | null;
  legal_address: string | null;
  actual_address: string | null;
  phone: string | null;
  email: string | null;
  bank_name: string | null;
  bank_account: string | null;
  correspondent_account: string | null;
  bik: string | null;
  director_name: string | null;
  director_position: string | null;
  created_at: string;
  updated_at: string;
}

export const useRequisites = () => {
  const [requisites, setRequisites] = useState<RequisitesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequisites = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/requisites');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setRequisites(data.data);
          } else {
            throw new Error('Failed to fetch requisites');
          }
        } else {
          throw new Error('Failed to fetch requisites');
        }
      } catch (err) {
        setError('Failed to fetch requisites');
        console.error('Error fetching requisites:', err);
        setRequisites(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRequisites();
  }, []);

  return { requisites, loading, error };
};
