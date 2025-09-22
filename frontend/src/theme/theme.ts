export interface ThemeColors {
  background: string;
  text: string;
  accent: string;
  brand: string;
  glassBorder: string; // rgba для бордера стекла
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
  }
};

export function applyTheme(theme: Theme = defaultTheme): void {
  const root = document.documentElement;
  root.style.setProperty('--bg', theme.colors.background);
  root.style.setProperty('--text', theme.colors.text);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--brand', theme.colors.brand);
  root.style.setProperty('--glass-border', theme.colors.glassBorder);
  root.style.setProperty('--radius-xl', theme.radius.xl);
  root.style.setProperty('--radius-lg', theme.radius.lg);
  root.style.setProperty('--blur-glass', theme.blur.glass);
}
