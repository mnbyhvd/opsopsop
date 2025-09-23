import { useState, useEffect } from 'react';
import API_ENDPOINTS from '../config/api';

export interface FooterSettings {
  id: number;
  company_name: string;
  company_subtitle: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  working_hours: string;
  form_title: string;
  form_description: string;
  privacy_policy_url: string;
  created_at: string;
  updated_at: string;
}

// Fallback данные
const fallbackData: FooterSettings = {
  id: 1,
  company_name: 'МАСТЕР',
  company_subtitle: 'Элемент',
  contact_phone: '+7 (999) 999-99-99',
  contact_email: 'email@gmail.ru',
  contact_address: 'г. Москва, ул. Остоженка, д.1/9',
  working_hours: 'Пн-Пт 10:00-18:00',
  form_title: 'СВЯЖИТЕСЬ С НАМИ',
  form_description: 'Оставьте заявку и получите спецификацию и коммерческое предложение, подобранные именно под ваши задачи.',
  privacy_policy_url: '#privacy',
  created_at: '',
  updated_at: ''
};

export const useFooterSettings = () => {
  const [settings, setSettings] = useState<FooterSettings>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.FOOTER_SETTINGS);
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setSettings(data.data);
            setError(null);
          }
        }
      } catch (err) {
        setError('Failed to fetch footer settings');
        console.error('Error fetching footer settings:', err);
        // Use fallback data on error
        setSettings(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};
