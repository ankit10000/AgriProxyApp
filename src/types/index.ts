// User Types
export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location: string;
  memberSince: string;
  totalArea: string;
  crops: string[];
  isPremium: boolean;
  avatar?: string;
  username?: string;
  fullName?: string;
  address?: {
    addressLine?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

// Product Types
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  inStock: boolean;
  image?: string;
  description?: string;
  brand?: string;
  weight?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

// Crop Types
export interface Crop {
  id: number;
  name: string;
  planted: string;
  area: string;
  status: 'Growing' | 'Harvest Ready' | 'Dormant';
  progress: number;
  variety?: string;
  expectedHarvest?: string;
}

// Notification Types
export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: 'info' | 'warning' | 'success' | 'error';
}

// Soil Test Types
export interface SoilTest {
  id: number;
  date: string;
  status: 'completed' | 'processing' | 'failed';
  ph?: number;
  nitrogen?: 'High' | 'Medium' | 'Low';
  phosphorus?: 'High' | 'Medium' | 'Low';
  potassium?: 'High' | 'Medium' | 'Low';
  recommendations: string[];
  location?: string;
  sampleType?: string;
}

// Plant Disease Types
export interface PlantDisease {
  id: number;
  date: string;
  crop: string;
  disease: string;
  severity: 'High' | 'Moderate' | 'Low';
  confidence: number;
  treatment: string;
  status: 'scanning' | 'identified' | 'treated' | 'monitoring';
  imageUrl?: string;
  notes?: string;
}

// Navigation Types
export type TabName = 'home' | 'calendar' | 'store' | 'profile' | 'notifications' | 'soiltesting' | 'plantdisease' | 'cart';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    sizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    weights: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}