import { SEVERITY_LEVELS, SOIL_TEST_STATUS, PLANT_DISEASE_STATUS } from './constants';

// Format price with currency
export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};

// Format date
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format relative time
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

// Get status color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case SOIL_TEST_STATUS.COMPLETED:
    case PLANT_DISEASE_STATUS.TREATED:
      return '#10b981';
    case SOIL_TEST_STATUS.PROCESSING:
    case PLANT_DISEASE_STATUS.IDENTIFIED:
      return '#f59e0b';
    case SOIL_TEST_STATUS.FAILED:
      return '#ef4444';
    case PLANT_DISEASE_STATUS.MONITORING:
      return '#3b82f6';
    default:
      return '#6b7280';
  }
};

// Get severity color
export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case SEVERITY_LEVELS.HIGH:
      return '#10b981';
    case SEVERITY_LEVELS.MODERATE:
      return '#f59e0b';
    case SEVERITY_LEVELS.LOW:
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

// Get disease severity color (reverse logic for diseases)
export const getDiseaseSeverityColor = (severity: string): string => {
  switch (severity) {
    case SEVERITY_LEVELS.HIGH:
      return '#ef4444';
    case SEVERITY_LEVELS.MODERATE:
      return '#f59e0b';
    case SEVERITY_LEVELS.LOW:
      return '#10b981';
    default:
      return '#6b7280';
  }
};

// Validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Indian format)
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Check if string is empty or whitespace
export const isEmpty = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};

// Safe JSON parse
export const safeJsonParse = <T = any>(str: string, fallback: T): T => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

// Array chunk utility
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};