import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import SimpleLogin from './components/SimpleLogin';
import { useSimpleAuth } from './hooks/useSimpleAuth';

const App: React.FC = () => {
  const { isAuthenticated, loading, login, logout } = useSimpleAuth();
  const [error, setError] = useState<string>('');

  const handleLogin = (username: string, password: string) => {
    setError('');
    if (login(username, password)) {
      setError('');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SimpleLogin onLogin={handleLogin} error={error} />;
  }

  return (
    <Router basename="/admin">
      <div className="min-h-screen">
        <Routes>
          <Route path="/*" element={<AdminDashboard onLogout={logout} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
