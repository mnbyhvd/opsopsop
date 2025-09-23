// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  HERO: `${API_BASE_URL}/api/hero`,
  NAVIGATION: `${API_BASE_URL}/api/navigation`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  LEADS: `${API_BASE_URL}/api/leads`,
  LEADS_STATS: `${API_BASE_URL}/api/leads/stats/overview`,
  REQUISITES: `${API_BASE_URL}/api/requisites`,
  DOCUMENTS: `${API_BASE_URL}/api/documents`,
  VIDEOS: `${API_BASE_URL}/api/videos`,
  ABOUT: `${API_BASE_URL}/api/about`,
  ADVANTAGES: `${API_BASE_URL}/api/advantages`,
  TECHNICAL_SPECS: `${API_BASE_URL}/api/technical-specs`,
  FOOTER: `${API_BASE_URL}/api/footer`,
  FOOTER_SETTINGS: `${API_BASE_URL}/api/footer-settings`,
  PRODUCT_MODALS: `${API_BASE_URL}/api/product-modals`,
  SCROLL_SECTION: `${API_BASE_URL}/api/scroll-section`,
};

export default API_ENDPOINTS;
