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

  // About
  async getAbout() {
    return this.request(API_ENDPOINTS.ABOUT);
  }

  // Products
  async getProducts() {
    return this.request(API_ENDPOINTS.PRODUCTS);
  }

  async getProduct(id: number) {
    return this.request(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  }

  async createProduct(productData: any) {
    return this.request(API_ENDPOINTS.PRODUCTS, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: number, productData: any) {
    return this.request(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: number) {
    return this.request(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories() {
    return this.request(API_ENDPOINTS.CATEGORIES);
  }

  async getUniqueCategories() {
    return this.request(`${API_ENDPOINTS.CATEGORIES}/unique`);
  }

  async createCategory(categoryData: any) {
    return this.request(API_ENDPOINTS.CATEGORIES, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: number, categoryData: any) {
    return this.request(`${API_ENDPOINTS.CATEGORIES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: number) {
    return this.request(`${API_ENDPOINTS.CATEGORIES}/${id}`, {
      method: 'DELETE',
    });
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

  async getVideo(id: number) {
    return this.request(`${API_ENDPOINTS.VIDEOS}/${id}`);
  }

  async createVideo(videoData: any) {
    return this.request(API_ENDPOINTS.VIDEOS, {
      method: 'POST',
      body: JSON.stringify(videoData),
    });
  }

  async updateVideo(id: number, videoData: any) {
    return this.request(`${API_ENDPOINTS.VIDEOS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(videoData),
    });
  }

  async deleteVideo(id: number) {
    return this.request(`${API_ENDPOINTS.VIDEOS}/${id}`, {
      method: 'DELETE',
    });
  }

  async getVideoSettings() {
    return this.request(`${API_ENDPOINTS.VIDEOS}/settings`);
  }

  async updateVideoSettings(settingsData: any) {
    return this.request(`${API_ENDPOINTS.VIDEOS}/settings`, {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
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

  // Upload
  async uploadFile(file: File, type: string = 'image') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request(API_ENDPOINTS.UPLOAD, {
      method: 'POST',
      body: formData,
    });
  }

  // Export
  async exportData(type: string = 'leads') {
    return this.request(`${API_ENDPOINTS.EXPORT}/${type}`, {
      method: 'GET',
    });
  }

  // Styles
  async getStyles() {
    return this.request(API_ENDPOINTS.STYLES);
  }

  async updateStyles(stylesData: any) {
    return this.request(API_ENDPOINTS.STYLES, {
      method: 'PUT',
      body: JSON.stringify(stylesData),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
