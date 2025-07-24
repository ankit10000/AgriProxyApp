// App Constants
export const APP_NAME = 'AgriProxy';
export const APP_VERSION = '1.0.0';

// API Constants
export const API_BASE_URL = 'https://api.agriproxy.com/v1';
export const API_TIMEOUT = 10000;

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: '@agriproxy_user_token',
  USER_DATA: '@agriproxy_user_data',
  CART_DATA: '@agriproxy_cart_data',
  FAVORITES: '@agriproxy_favorites',
  THEME_MODE: '@agriproxy_theme_mode',
} as const;

// Screen Names
export const SCREEN_NAMES = {
  HOME: 'Home',
  STORE: 'Store',
  CART: 'Cart',
  PROFILE: 'Profile',
  NOTIFICATIONS: 'Notifications',
  SOIL_TESTING: 'SoilTesting',
  PLANT_DISEASE: 'PlantDisease',
  CROP_CALENDAR: 'CropCalendar',
} as const;

// Tab Names
export const TAB_NAMES = {
  HOME: 'home',
  STORE: 'store',
  CART: 'cart',
  PROFILE: 'profile',
  NOTIFICATIONS: 'notifications',
  SOIL_TESTING: 'soiltesting',
  PLANT_DISEASE: 'plantdisease',
  CROP_CALENDAR: 'calendar',
} as const;

// Product Categories
export const PRODUCT_CATEGORIES = [
  'All',
  'Fungicides',
  'Herbicides',
  'Biopesticides',
  'Fertilizers',
] as const;

// Crop Status
export const CROP_STATUS = {
  GROWING: 'Growing',
  HARVEST_READY: 'Harvest Ready',
  DORMANT: 'Dormant',
} as const;

// Soil Test Status
export const SOIL_TEST_STATUS = {
  COMPLETED: 'completed',
  PROCESSING: 'processing',
  FAILED: 'failed',
} as const;

// Plant Disease Status
export const PLANT_DISEASE_STATUS = {
  IDENTIFIED: 'identified',
  TREATED: 'treated',
  MONITORING: 'monitoring',
} as const;

// Severity Levels
export const SEVERITY_LEVELS = {
  HIGH: 'High',
  MODERATE: 'Moderate',
  LOW: 'Low',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Default Values
export const DEFAULTS = {
  DEBOUNCE_DELAY: 300,
  PAGE_SIZE: 20,
  PAGINATION_LIMIT: 10,
  SEARCH_MIN_LENGTH: 2,
  RATING_MAX: 5,
} as const;