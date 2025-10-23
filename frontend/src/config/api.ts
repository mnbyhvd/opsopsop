// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const API_ENDPOINTS = {
  HERO: `${API_BASE_URL}/hero`,
  NAVIGATION: `${API_BASE_URL}/navigation`,
  PRODUCTS: `${API_BASE_URL}/products`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  LEADS: `${API_BASE_URL}/leads`,
  LEADS_STATS: `${API_BASE_URL}/leads/stats/overview`,
  REQUISITES: `${API_BASE_URL}/requisites`,
  DOCUMENTS: `${API_BASE_URL}/documents`,
  VIDEOS: `${API_BASE_URL}/videos`,
  VIDEO_SETTINGS: `${API_BASE_URL}/videos/settings`,
  ABOUT: `${API_BASE_URL}/about`,
  ADVANTAGES: `${API_BASE_URL}/advantages`,
  TECHNICAL_SPECS: `${API_BASE_URL}/technical-specs`,
  FOOTER: `${API_BASE_URL}/footer`,
  FOOTER_SETTINGS: `${API_BASE_URL}/footer-settings`,
  PRODUCT_MODALS: `${API_BASE_URL}/product-modals`,
  SCROLL_SECTION: `${API_BASE_URL}/scroll-section`,
  UPLOAD: `${API_BASE_URL}/upload`,
  EXPORT: `${API_BASE_URL}/export`,
};

export default API_ENDPOINTS;
