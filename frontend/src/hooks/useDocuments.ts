import { useState, useEffect } from 'react';

interface Document {
  id: number;
  title: string;
  url: string;
  type: 'document' | 'certificate';
  sort_order: number;
  is_active: boolean;
  file_size?: number;
  file_type?: string;
  original_filename?: string;
  upload_date?: string;
  created_at: string;
  updated_at: string;
}

interface DocumentsResponse {
  success: boolean;
  data: Document[];
  error?: string;
}

const API_URL = '/api/documents';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [certificates, setCertificates] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      
      if (response.ok) {
        const result: DocumentsResponse = await response.json();
        if (result.success && result.data) {
          // Разделяем документы и сертификаты
          const docs = result.data.filter(item => item.type === 'document' && item.is_active);
          const certs = result.data.filter(item => item.type === 'certificate' && item.is_active);
          
          // Сортируем по sort_order
          docs.sort((a, b) => a.sort_order - b.sort_order);
          certs.sort((a, b) => a.sort_order - b.sort_order);
          
          setDocuments(docs);
          setCertificates(certs);
          return;
        }
      }
      throw new Error('Failed to fetch documents');
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to fetch documents');
      
      // Fallback данные
      const fallbackDocuments: Document[] = [
        {
          id: 1,
          title: 'Техническое руководство',
          url: '/downloads/technical-manual.pdf',
          type: 'document',
          sort_order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Руководство по проектированию',
          url: '/downloads/design-guide.pdf',
          type: 'document',
          sort_order: 2,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          title: 'Руководство по эксплуатации',
          url: '/downloads/operating-manual.pdf',
          type: 'document',
          sort_order: 3,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 4,
          title: 'Монтажная инструкция',
          url: '/downloads/installation-instructions.pdf',
          type: 'document',
          sort_order: 4,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      const fallbackCertificates: Document[] = [
        {
          id: 5,
          title: 'Сертификат соответствия ГОСТ',
          url: '/downloads/gost-certificate.pdf',
          type: 'certificate',
          sort_order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 6,
          title: 'Сертификат пожарной безопасности',
          url: '/downloads/fire-safety-certificate.pdf',
          type: 'certificate',
          sort_order: 2,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 7,
          title: 'Сертификат качества ISO 9001',
          url: '/downloads/iso-certificate.pdf',
          type: 'certificate',
          sort_order: 3,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setDocuments(fallbackDocuments);
      setCertificates(fallbackCertificates);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    certificates,
    loading,
    error,
    refetch: fetchDocuments
  };
};
