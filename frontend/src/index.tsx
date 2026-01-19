import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { applyTheme, defaultTheme, Theme } from './theme/theme';

// Функция для загрузки стилей из API
async function loadStylesFromAPI(): Promise<Theme | null> {
  try {
    const API_BASE_URL = process.env.REACT_APP_API_URL || '';
    const response = await fetch(`${API_BASE_URL}/api/styles`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.data) {
      const apiData = result.data;
      
      // Преобразуем данные из API в формат Theme
      const theme: Theme = {
        name: 'site-styles',
        colors: {
          background: apiData.colors?.background || defaultTheme.colors.background,
          text: apiData.colors?.text || defaultTheme.colors.text,
          accent: apiData.colors?.accent || defaultTheme.colors.accent,
          brand: apiData.colors?.brand || defaultTheme.colors.brand,
          glassBorder: apiData.colors?.glassBorder || defaultTheme.colors.glassBorder
        },
        radius: {
          xl: apiData.radius?.xl || defaultTheme.radius.xl,
          lg: apiData.radius?.lg || defaultTheme.radius.lg
        },
        blur: {
          glass: apiData.blur?.glass || defaultTheme.blur.glass
        },
        fonts: apiData.fonts || defaultTheme.fonts,
        buttons: apiData.buttons || defaultTheme.buttons,
        inputs: apiData.inputs || defaultTheme.inputs,
        search: apiData.search || defaultTheme.search,
        navigation: apiData.navigation || defaultTheme.navigation,
        cards: apiData.cards || defaultTheme.cards
      };
      
      return theme;
    }
  } catch (error) {
    console.error('Error loading styles from API:', error);
  }
  
  return null;
}

// Загружаем стили и применяем их
loadStylesFromAPI().then(theme => {
  applyTheme(theme || defaultTheme);
}).catch(error => {
  console.error('Failed to load styles:', error);
  applyTheme(defaultTheme);
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
