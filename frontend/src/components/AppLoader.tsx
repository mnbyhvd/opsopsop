import React, { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';

interface AppLoaderProps {
  children: React.ReactNode;
  loadingTime?: number;
}

const AppLoader: React.FC<AppLoaderProps> = ({ 
  children, 
  loadingTime = 2000 
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingTime);

    return () => clearTimeout(timer);
  }, [loadingTime]);

  if (isLoading) {
    return <LoadingScreen message="ЗАГРУЗКА ПРИЛОЖЕНИЯ..." />;
  }

  return <>{children}</>;
};

export default AppLoader;
