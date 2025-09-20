// API Configuration
export const API_CONFIG = {
  // Backend API base URLs
  DEVELOPMENT: {
    BASE_URL: 'http://192.168.1.8:3001/api',
    TIMEOUT: 10000,
  },
  PRODUCTION: {
    BASE_URL: 'https://your-production-api.com/api',
    TIMEOUT: 15000,
  },

  // Get current config based on environment
  getCurrent: () => {
    return __DEV__ ? API_CONFIG.DEVELOPMENT : API_CONFIG.PRODUCTION;
  },

  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      SIGNUP: '/auth/signup',
      PROFILE: '/auth/profile',
      LOGOUT: '/auth/logout',
      UPDATE_PROFILE: '/auth/profile',
      DELETE_ACCOUNT: '/auth/account',
    },
    PROFILE: {
      GET: '/profile',
      UPDATE: '/profile',
      UPLOAD_AVATAR: '/profile/avatar',
      DELETE_AVATAR: '/profile/avatar',
      CHANGE_PASSWORD: '/profile/password',
      DELETE_ACCOUNT: '/profile/account',
    },
    // Add more endpoints here as you build more features
    CROPS: {
      LIST: '/crops',
      CREATE: '/crops',
      UPDATE: '/crops/:id',
      DELETE: '/crops/:id',
    },
    MARKET: {
      PRICES: '/market/prices',
      TRENDS: '/market/trends',
    },
  },
};

// Request configuration
export const REQUEST_CONFIG = {
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,

  // Common headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default API_CONFIG;