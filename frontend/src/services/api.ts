import API_ENDPOINTS from '../config/api';

export interface AboutItem {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TechnicalSpec {
  id: number;
  title: string;
  description: string;
  value?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroSection {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  background_image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: number;
  title: string;
  url: string;
  sort_order: number;
  parent_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FooterItem {
  id: number;
  section_type: string;
  title?: string;
  content?: string;
  url?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_ENDPOINTS.HERO.replace('/api/hero', '')}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // About Section API
  async getAboutItems(): Promise<{ success: boolean; data: AboutItem[] }> {
    return this.request<{ success: boolean; data: AboutItem[] }>(API_ENDPOINTS.ABOUT);
  }

  async createAboutItem(item: Omit<AboutItem, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data: AboutItem }> {
    return this.request<{ success: boolean; data: AboutItem }>('/about', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateAboutItem(id: number, item: Partial<AboutItem>): Promise<{ success: boolean; data: AboutItem }> {
    return this.request<{ success: boolean; data: AboutItem }>(`/about/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteAboutItem(id: number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/about/${id}`, {
      method: 'DELETE',
    });
  }

  // Technical Specs API
  async getTechnicalSpecs(): Promise<{ success: boolean; data: TechnicalSpec[] }> {
    return this.request<{ success: boolean; data: TechnicalSpec[] }>('/api/technical-specs');
  }

  async createTechnicalSpec(spec: Omit<TechnicalSpec, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data: TechnicalSpec }> {
    return this.request<{ success: boolean; data: TechnicalSpec }>('/api/technical-specs', {
      method: 'POST',
      body: JSON.stringify(spec),
    });
  }

  async updateTechnicalSpec(id: number, spec: Partial<TechnicalSpec>): Promise<{ success: boolean; data: TechnicalSpec }> {
    return this.request<{ success: boolean; data: TechnicalSpec }>(`/api/technical-specs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(spec),
    });
  }

  async deleteTechnicalSpec(id: number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/technical-specs/${id}`, {
      method: 'DELETE',
    });
  }

  // Hero Section API
  async getHeroSection(): Promise<{ success: boolean; data: HeroSection | null }> {
    return this.request<{ success: boolean; data: HeroSection | null }>('/api/hero');
  }

  async createHeroSection(hero: Omit<HeroSection, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data: HeroSection }> {
    return this.request<{ success: boolean; data: HeroSection }>('/api/hero', {
      method: 'POST',
      body: JSON.stringify(hero),
    });
  }

  async updateHeroSection(id: number, hero: Partial<HeroSection>): Promise<{ success: boolean; data: HeroSection }> {
    return this.request<{ success: boolean; data: HeroSection }>(`/api/hero/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hero),
    });
  }

  // Navigation API
  async getNavigationItems(): Promise<{ success: boolean; data: NavigationItem[] }> {
    return this.request<{ success: boolean; data: NavigationItem[] }>('/api/navigation');
  }

  async createNavigationItem(item: Omit<NavigationItem, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data: NavigationItem }> {
    return this.request<{ success: boolean; data: NavigationItem }>('/api/navigation', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateNavigationItem(id: number, item: Partial<NavigationItem>): Promise<{ success: boolean; data: NavigationItem }> {
    return this.request<{ success: boolean; data: NavigationItem }>(`/navigation/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteNavigationItem(id: number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/navigation/${id}`, {
      method: 'DELETE',
    });
  }

  // Footer API
  async getFooterItems(): Promise<{ success: boolean; data: FooterItem[] }> {
    return this.request<{ success: boolean; data: FooterItem[] }>('/api/footer');
  }

  async createFooterItem(item: Omit<FooterItem, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data: FooterItem }> {
    return this.request<{ success: boolean; data: FooterItem }>('/api/footer', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateFooterItem(id: number, item: Partial<FooterItem>): Promise<{ success: boolean; data: FooterItem }> {
    return this.request<{ success: boolean; data: FooterItem }>(`/footer/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteFooterItem(id: number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/footer/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;

// Export individual API functions for backward compatibility
export const aboutAPI = {
  getItems: () => apiService.getAboutItems(),
  createItem: (item: Omit<AboutItem, 'id' | 'created_at' | 'updated_at'>) => apiService.createAboutItem(item),
  updateItem: (id: number, item: Partial<AboutItem>) => apiService.updateAboutItem(id, item),
  deleteItem: (id: number) => apiService.deleteAboutItem(id)
};

export const technicalSpecsAPI = {
  getItems: () => apiService.getTechnicalSpecs(),
  createItem: (item: Omit<TechnicalSpec, 'id' | 'created_at' | 'updated_at'>) => apiService.createTechnicalSpec(item),
  updateItem: (id: number, item: Partial<TechnicalSpec>) => apiService.updateTechnicalSpec(id, item),
  deleteItem: (id: number) => apiService.deleteTechnicalSpec(id)
};

export const heroAPI = {
  getItem: () => apiService.getHeroSection(),
  createItem: (item: Omit<HeroSection, 'id' | 'created_at' | 'updated_at'>) => apiService.createHeroSection(item),
  updateItem: (id: number, item: Partial<HeroSection>) => apiService.updateHeroSection(id, item)
};

export const navigationAPI = {
  getItems: () => apiService.getNavigationItems(),
  createItem: (item: Omit<NavigationItem, 'id' | 'created_at' | 'updated_at'>) => apiService.createNavigationItem(item),
  updateItem: (id: number, item: Partial<NavigationItem>) => apiService.updateNavigationItem(id, item),
  deleteItem: (id: number) => apiService.deleteNavigationItem(id)
};

export const footerAPI = {
  getItems: () => apiService.getFooterItems(),
  createItem: (item: Omit<FooterItem, 'id' | 'created_at' | 'updated_at'>) => apiService.createFooterItem(item),
  updateItem: (id: number, item: Partial<FooterItem>) => apiService.updateFooterItem(id, item),
  deleteItem: (id: number) => apiService.deleteFooterItem(id)
};