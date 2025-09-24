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
  async getAbout() {
    return this.request(API_ENDPOINTS.ABOUT);
  }

  // Products
  async getProducts() {
    return this.request(API_ENDPOINTS.PRODUCTS);
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
}

export const apiService = new ApiService();
export default apiService;
