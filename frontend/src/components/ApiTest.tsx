import React, { useState, useEffect } from 'react';

const ApiTest: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true);
        console.log('Testing API connection...');
        
        // Прямой запрос к API
        const response = await fetch('/api/about');
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API Response:', result);
        setData(result);
        setError(null);
      } catch (err) {
        console.error('API Test Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p style={{ color: '#F2F0F0' }}>Тестирование API...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p style={{ color: '#D71920' }}>Ошибка API: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 style={{ color: '#F2F0F0', marginBottom: '20px' }}>API Test Results:</h2>
      <pre style={{ color: '#B8B8B8', backgroundColor: '#2A2A2A', padding: '20px', borderRadius: '8px' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default ApiTest;
