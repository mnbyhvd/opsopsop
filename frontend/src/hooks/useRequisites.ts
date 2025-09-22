import { useState, useEffect } from 'react';

interface RequisitesData {
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

const defaultRequisites: RequisitesData = {
  id: 1,
  company_name: 'ООО "МАСТЕР"',
  legal_name: 'Общество с ограниченной ответственностью "МАСТЕР"',
  inn: '1234567890',
  kpp: '123456789',
  ogrn: '1234567890123',
  legal_address: 'г. Москва, ул. Остоженка, д.1/9',
  actual_address: 'г. Москва, ул. Остоженка, д.1/9',
  phone: '+7 (999) 999-99-99',
  email: 'email@gmail.ru',
  website: 'https://example.com',
  bank_name: 'ПАО "Сбербанк"',
  bank_account: '40702810123456789012',
  correspondent_account: '30101810400000000225',
  bik: '044525225',
  director_name: 'Иванов Иван Иванович',
  director_position: 'Генеральный директор',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const useRequisites = () => {
  const [requisites, setRequisites] = useState<RequisitesData>(defaultRequisites);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequisites = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/requisites');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setRequisites(data.data);
            setError(null);
          } else {
            throw new Error('Failed to fetch requisites');
          }
        } else {
          throw new Error('Failed to fetch requisites');
        }
      } catch (err) {
        setError('Failed to fetch requisites');
        console.error('Error fetching requisites:', err);
        setRequisites(defaultRequisites); // Use default requisites on error
      } finally {
        setLoading(false);
      }
    };

    fetchRequisites();
  }, []);

  return { requisites, loading, error };
};
