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

// Product types
export interface ProductImage {
  id: number;
  image_url: string;
  alt_text: string;
  sort_order: number;
}

export interface ProductDocument {
  id: number;
  name: string;
  description: string;
  file_url: string;
  file_type: string;
  file_size: number;
  sort_order: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category_name: string;
  category_name_from_table: string;
  category_id: number;
  specifications: Record<string, any>;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
  documents?: ProductDocument[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

export interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
