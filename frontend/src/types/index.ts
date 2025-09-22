// Navigation types
export interface NavigationItem {
  id: number;
  title: string;
  url: string;
  sort_order: number;
  parent_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Footer types
export interface FooterItem {
  id: number;
  section_type: 'navigation' | 'contacts' | 'legal' | 'social';
  title: string | null;
  content: string | null;
  url: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FooterData {
  navigation: FooterItem[];
  contacts: FooterItem[];
  legal: FooterItem[];
  social: FooterItem[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface ApiError {
  success: false;
  error: string;
}

// Component props types
export interface NavigationProps {
  className?: string;
}

export interface FooterProps {
  className?: string;
}

// Hook return types
export interface UseNavigationReturn {
  navigation: NavigationItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseFooterReturn {
  footerData: FooterData;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
