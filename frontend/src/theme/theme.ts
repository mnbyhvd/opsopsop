export interface ThemeColors {
  background: string;
  text: string;
  accent: string;
  brand: string;
  glassBorder: string; // rgba для бордера стекла
}

export interface ThemeFonts {
  headings: string;
  body: string;
  headingsFallback: string;
  bodyFallback: string;
  headingsColor: string;
  bodyColor: string;
  headingsUrl?: string; // URL для загрузки кастомного шрифта заголовков
  bodyUrl?: string; // URL для загрузки кастомного шрифта текста
}

export interface ButtonStyles {
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  hoverText: string;
  hoverBorder: string;
  radius: string;
}

export interface InputStyles {
  bg: string;
  text: string;
  border: string;
  focusBg: string;
  focusText: string;
  focusBorder: string;
  radius: string;
  placeholder: string;
}

export interface SearchStyles {
  bg: string;
  text: string;
  border: string;
  focusBg: string;
  focusBorder: string;
  radius: string;
}

export interface NavigationStyles {
  bg: string;
  text: string;
  linkHover: string;
  border: string;
  radius: string;
}

export interface CardStyles {
  bg: string;
  text: string;
  border: string;
  radius: string;
  hoverBg: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  radius: {
    xl: string;
    lg: string;
  };
  blur: {
    glass: string; // blur(px)
  };
  fonts?: ThemeFonts;
  buttons?: {
    primary: ButtonStyles;
    secondary: ButtonStyles;
  };
  inputs?: InputStyles;
  search?: SearchStyles;
  navigation?: NavigationStyles;
  cards?: CardStyles;
}

export const defaultTheme: Theme = {
  name: 'aps-master-dark',
  colors: {
    background: '#0D0D0D',
    text: '#F5F5F5',
    accent: '#D71A20',
    brand: '#ECC30B',
    glassBorder: 'rgba(255,255,255,0.1)'
  },
  radius: {
    xl: '16px',
    lg: '12px'
  },
  blur: {
    glass: '12px'
  },
  fonts: {
    headings: 'Bebas Neue',
    body: 'Inter',
    headingsFallback: 'Arial Black, Arial, sans-serif',
    bodyFallback: 'sans-serif',
    headingsColor: '#F5F5F5',
    bodyColor: '#F5F5F5',
    headingsUrl: undefined,
    bodyUrl: undefined
  },
  buttons: {
    primary: {
      bg: '#FFFFFF',
      text: '#0D0D0D',
      border: '#FFFFFF',
      hoverBg: 'rgba(255, 255, 255, 0.1)',
      hoverText: '#FFFFFF',
      hoverBorder: 'transparent',
      radius: '30px'
    },
    secondary: {
      bg: 'transparent',
      text: '#FFFFFF',
      border: '#FFFFFF',
      hoverBg: 'rgba(255, 255, 255, 0.1)',
      hoverText: '#FFFFFF',
      hoverBorder: '#FFFFFF',
      radius: '30px'
    }
  },
  inputs: {
    bg: 'rgba(255, 255, 255, 0.05)',
    text: '#F5F5F5',
    border: 'rgba(255, 255, 255, 0.1)',
    focusBg: 'rgba(255, 255, 255, 0.08)',
    focusText: '#F5F5F5',
    focusBorder: 'rgba(255, 255, 255, 0.6)',
    radius: '12px',
    placeholder: 'rgba(255, 255, 255, 0.5)'
  },
  search: {
    bg: 'rgba(255, 255, 255, 0.05)',
    text: '#F5F5F5',
    border: 'rgba(255, 255, 255, 0.1)',
    focusBg: 'rgba(255, 255, 255, 0.08)',
    focusBorder: 'rgba(255, 255, 255, 0.6)',
    radius: '12px'
  },
  navigation: {
    bg: 'rgba(255, 255, 255, 0.05)',
    text: '#F5F5F5',
    linkHover: '#D71920',
    border: 'rgba(255, 255, 255, 0.1)',
    radius: '16px'
  },
  cards: {
    bg: 'rgba(255, 255, 255, 0.05)',
    text: '#F5F5F5',
    border: 'rgba(255, 255, 255, 0.1)',
    radius: '16px',
    hoverBg: 'rgba(255, 255, 255, 0.08)'
  }
};

export function applyTheme(theme: Theme = defaultTheme): void {
  const root = document.documentElement;
  
  // Основные цвета
  root.style.setProperty('--bg', theme.colors.background);
  root.style.setProperty('--text', theme.colors.text);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--brand', theme.colors.brand);
  root.style.setProperty('--glass-border', theme.colors.glassBorder);
  
  // Радиусы и эффекты
  root.style.setProperty('--radius-xl', theme.radius.xl);
  root.style.setProperty('--radius-lg', theme.radius.lg);
  root.style.setProperty('--blur-glass', theme.blur.glass);
  
  // Шрифты
  if (theme.fonts) {
    root.style.setProperty('--font-headings', theme.fonts.headings);
    root.style.setProperty('--font-body', theme.fonts.body);
    root.style.setProperty('--font-headings-fallback', theme.fonts.headingsFallback);
    root.style.setProperty('--font-body-fallback', theme.fonts.bodyFallback);
    root.style.setProperty('--font-headings-color', theme.fonts.headingsColor);
    root.style.setProperty('--font-body-color', theme.fonts.bodyColor);
    
    // Динамически загружаем кастомные шрифты, если указаны URL
    if (theme.fonts.headingsUrl) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = theme.fonts.headingsUrl;
      link.id = 'custom-headings-font';
      // Удаляем предыдущий, если есть
      const existing = document.getElementById('custom-headings-font');
      if (existing) existing.remove();
      document.head.appendChild(link);
    }
    
    if (theme.fonts.bodyUrl) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = theme.fonts.bodyUrl;
      link.id = 'custom-body-font';
      // Удаляем предыдущий, если есть
      const existing = document.getElementById('custom-body-font');
      if (existing) existing.remove();
      document.head.appendChild(link);
    }
  }
  
  // Кнопки
  if (theme.buttons) {
    root.style.setProperty('--button-primary-bg', theme.buttons.primary.bg);
    root.style.setProperty('--button-primary-text', theme.buttons.primary.text);
    root.style.setProperty('--button-primary-border', theme.buttons.primary.border);
    root.style.setProperty('--button-primary-hover-bg', theme.buttons.primary.hoverBg);
    root.style.setProperty('--button-primary-hover-text', theme.buttons.primary.hoverText);
    root.style.setProperty('--button-primary-hover-border', theme.buttons.primary.hoverBorder);
    root.style.setProperty('--button-primary-radius', theme.buttons.primary.radius);
    
    root.style.setProperty('--button-secondary-bg', theme.buttons.secondary.bg);
    root.style.setProperty('--button-secondary-text', theme.buttons.secondary.text);
    root.style.setProperty('--button-secondary-border', theme.buttons.secondary.border);
    root.style.setProperty('--button-secondary-hover-bg', theme.buttons.secondary.hoverBg);
    root.style.setProperty('--button-secondary-hover-text', theme.buttons.secondary.hoverText);
    root.style.setProperty('--button-secondary-hover-border', theme.buttons.secondary.hoverBorder);
    root.style.setProperty('--button-secondary-radius', theme.buttons.secondary.radius);
  }
  
  // Поля ввода
  if (theme.inputs) {
    root.style.setProperty('--input-bg', theme.inputs.bg);
    root.style.setProperty('--input-text', theme.inputs.text);
    root.style.setProperty('--input-border', theme.inputs.border);
    root.style.setProperty('--input-focus-bg', theme.inputs.focusBg);
    root.style.setProperty('--input-focus-text', theme.inputs.focusText);
    root.style.setProperty('--input-focus-border', theme.inputs.focusBorder);
    root.style.setProperty('--input-radius', theme.inputs.radius);
    root.style.setProperty('--input-placeholder', theme.inputs.placeholder);
  }
  
  // Поиск
  if (theme.search) {
    root.style.setProperty('--search-bg', theme.search.bg);
    root.style.setProperty('--search-text', theme.search.text);
    root.style.setProperty('--search-border', theme.search.border);
    root.style.setProperty('--search-focus-bg', theme.search.focusBg);
    root.style.setProperty('--search-focus-border', theme.search.focusBorder);
    root.style.setProperty('--search-radius', theme.search.radius);
  }
  
  // Навигация
  if (theme.navigation) {
    root.style.setProperty('--nav-bg', theme.navigation.bg);
    root.style.setProperty('--nav-text', theme.navigation.text);
    root.style.setProperty('--nav-link-hover', theme.navigation.linkHover);
    root.style.setProperty('--nav-border', theme.navigation.border);
    root.style.setProperty('--nav-radius', theme.navigation.radius);
  }
  
  // Карточки
  if (theme.cards) {
    root.style.setProperty('--card-bg', theme.cards.bg);
    root.style.setProperty('--card-text', theme.cards.text);
    root.style.setProperty('--card-border', theme.cards.border);
    root.style.setProperty('--card-radius', theme.cards.radius);
    root.style.setProperty('--card-hover-bg', theme.cards.hoverBg);
  }
}
