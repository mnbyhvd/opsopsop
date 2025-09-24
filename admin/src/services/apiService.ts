// Universal API Service for Admin with error handling
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

  // Leads
  async getLeads() {
    return this.request(API_ENDPOINTS.LEADS);
  }

  async createLead(leadData: any) {
    return this.request(API_ENDPOINTS.LEADS, {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  }

  async updateLead(id: number, leadData: any) {
    return this.request(`${API_ENDPOINTS.LEADS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    });
  }

  async deleteLead(id: number) {
    return this.request(`${API_ENDPOINTS.LEADS}/${id}`, {
      method: 'DELETE',
    });
  }

  // Leads Stats
  async getLeadsStats() {
    return this.request(API_ENDPOINTS.LEADS_STATS);
  }

  // Requisites
  async getRequisites() {
    return this.request(API_ENDPOINTS.REQUISITES);
  }

  async updateRequisites(requisitesData: any) {
    return this.request(API_ENDPOINTS.REQUISITES, {
      method: 'PUT',
      body: JSON.stringify(requisitesData),
    });
  }

  // Documents
  async getDocuments() {
    return this.request(API_ENDPOINTS.DOCUMENTS);
  }

  // Videos
  async getVideos() {
    return this.request(API_ENDPOINTS.VIDEOS);
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

  // Footer Settings
  async getFooterSettings() {
    return this.request(API_ENDPOINTS.FOOTER_SETTINGS);
  }

  async updateFooterSettings(settingsData: any) {
    return this.request(API_ENDPOINTS.FOOTER_SETTINGS, {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  }

  // Product Modals
  async getProductModals(areaId: string) {
    return this.request(`${API_ENDPOINTS.PRODUCT_MODALS}/${areaId}`);
  }

  async createProductModal(modalData: any) {
    return this.request(API_ENDPOINTS.PRODUCT_MODALS, {
      method: 'POST',
      body: JSON.stringify(modalData),
    });
  }

  async updateProductModal(id: number, modalData: any) {
    return this.request(`${API_ENDPOINTS.PRODUCT_MODALS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(modalData),
    });
  }

  async deleteProductModal(id: number) {
    return this.request(`${API_ENDPOINTS.PRODUCT_MODALS}/${id}`, {
      method: 'DELETE',
    });
  }

  // Scroll Section
  async getScrollSection() {
    return this.request(API_ENDPOINTS.SCROLL_SECTION);
  }
}

export const apiService = new ApiService();
export default apiService;
