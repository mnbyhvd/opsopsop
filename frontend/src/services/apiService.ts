// Universal API Service with error handling and fallbacks
import { API_ENDPOINTS } from '../config/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Navigation
  async getNavigation() {
    return this.request(API_ENDPOINTS.NAVIGATION);
  }

  // Hero
  async getHero() {
    return this.request(API_ENDPOINTS.HERO);
  }

  // About
  async getAbout(group?: string) {
    const endpoint = group ? `${API_ENDPOINTS.ABOUT}?group=${encodeURIComponent(group)}` : API_ENDPOINTS.ABOUT;
    return this.request(endpoint);
  }

  // Products
  async getProducts() {
    return this.request(API_ENDPOINTS.PRODUCTS);
  }

  async getServices() {
    return this.request(API_ENDPOINTS.SERVICES);
  }

  async getPortfolioProjects() {
    return this.request(API_ENDPOINTS.PORTFOLIO);
  }

  async getPortfolioProject(slug: string) {
    return this.request(`${API_ENDPOINTS.PORTFOLIO}/${slug}`);
  }

  // Videos
  async getVideos() {
    return this.request(API_ENDPOINTS.VIDEOS);
  }

  // Documents
  async getDocuments() {
    return this.request(API_ENDPOINTS.DOCUMENTS);
  }

  // Technical Specs
  async getTechnicalSpecs() {
    return this.request(API_ENDPOINTS.TECHNICAL_SPECS);
  }

  // Homepage Blocks
  async getHomeBlocks() {
    return this.request(API_ENDPOINTS.HOME_BLOCKS);
  }

  // Page Meta
  async getPageMeta(pageKey: string) {
    return this.request(`${API_ENDPOINTS.PAGE_META}/${pageKey}`);
  }

  // Advantages
  async getAdvantages() {
    return this.request(API_ENDPOINTS.ADVANTAGES);
  }

  // Footer
  async getFooter() {
    return this.request(API_ENDPOINTS.FOOTER);
  }

  // Scroll Section
  async getScrollSection() {
    return this.request(API_ENDPOINTS.SCROLL_SECTION);
  }

  // Product Modals
  async getProductModals(areaId: string) {
    return this.request(`${API_ENDPOINTS.PRODUCT_MODALS}/${areaId}`);
  }

  // Leads
  async createLead(leadData: any) {
    return this.request(API_ENDPOINTS.LEADS, {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  }

  // Hero Section API
  async updateHeroSection(id: number, hero: any) {
    return this.request(`${API_ENDPOINTS.HERO}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hero),
    });
  }

  async createHeroSection(hero: any) {
    return this.request(API_ENDPOINTS.HERO, {
      method: 'POST',
      body: JSON.stringify(hero),
    });
  }

  // About Section API
  async createAboutItem(item: any) {
    return this.request(API_ENDPOINTS.ABOUT, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateAboutItem(id: number, item: any) {
    return this.request(`${API_ENDPOINTS.ABOUT}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteAboutItem(id: number) {
    return this.request(`${API_ENDPOINTS.ABOUT}/${id}`, {
      method: 'DELETE',
    });
  }

  // Technical Specs API
  async createTechnicalSpec(spec: any) {
    return this.request(API_ENDPOINTS.TECHNICAL_SPECS, {
      method: 'POST',
      body: JSON.stringify(spec),
    });
  }

  async updateTechnicalSpec(id: number, spec: any) {
    return this.request(`${API_ENDPOINTS.TECHNICAL_SPECS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(spec),
    });
  }

  async deleteTechnicalSpec(id: number) {
    return this.request(`${API_ENDPOINTS.TECHNICAL_SPECS}/${id}`, {
      method: 'DELETE',
    });
  }

  // Navigation API
  async createNavigationItem(item: any) {
    return this.request(API_ENDPOINTS.NAVIGATION, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateNavigationItem(id: number, item: any) {
    return this.request(`${API_ENDPOINTS.NAVIGATION}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteNavigationItem(id: number) {
    return this.request(`${API_ENDPOINTS.NAVIGATION}/${id}`, {
      method: 'DELETE',
    });
  }

  // Footer API
  async createFooterItem(item: any) {
    return this.request(API_ENDPOINTS.FOOTER, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateFooterItem(id: number, item: any) {
    return this.request(`${API_ENDPOINTS.FOOTER}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteFooterItem(id: number) {
    return this.request(`${API_ENDPOINTS.FOOTER}/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;
