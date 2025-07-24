import { API_BASE_URL, API_TIMEOUT } from '../utils/constants';
import { ApiResponse, Product, SoilTest, PlantDisease, User, Notification } from '../types';

// API Client Configuration
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private token: string | null = null;

  constructor(baseURL: string, timeout: number) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  setAuthToken(token: string) {
    this.token = token;
  }

  clearAuthToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as any).Authorization = `Bearer ${this.token}`;
    }

    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const config: RequestInit = {
      ...options,
      headers,
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          data: null as T,
          error: data.message || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      return {
        success: false,
        data: null as T,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL, API_TIMEOUT);

// API Service Functions
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post<{ user: User; token: string }>('/auth/login', credentials),
  
  register: (userData: Partial<User> & { password: string }) =>
    apiClient.post<{ user: User; token: string }>('/auth/register', userData),
  
  logout: () =>
    apiClient.post<{}>('/auth/logout'),
  
  refreshToken: () =>
    apiClient.post<{ token: string }>('/auth/refresh'),
};

export const userApi = {
  getProfile: () =>
    apiClient.get<User>('/user/profile'),
  
  updateProfile: (userData: Partial<User>) =>
    apiClient.put<User>('/user/profile', userData),
  
  deleteAccount: () =>
    apiClient.delete<{}>('/user/account'),
};

export const productsApi = {
  getProducts: (params?: { category?: string; search?: string; page?: number; limit?: number }) =>
    apiClient.get<{ products: Product[]; total: number; page: number }>(`/products${params ? '?' + new URLSearchParams(params as any).toString() : ''}`),
  
  getProduct: (id: number) =>
    apiClient.get<Product>(`/products/${id}`),
  
  searchProducts: (query: string) =>
    apiClient.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`),
};

export const soilTestApi = {
  getSoilTests: () =>
    apiClient.get<SoilTest[]>('/soil-tests'),
  
  createSoilTest: (testData: Omit<SoilTest, 'id'>) =>
    apiClient.post<SoilTest>('/soil-tests', testData),
  
  getSoilTest: (id: number) =>
    apiClient.get<SoilTest>(`/soil-tests/${id}`),
  
  uploadSample: (sampleData: FormData) =>
    apiClient.post<{ testId: number }>('/soil-tests/upload', sampleData),
};

export const plantDiseaseApi = {
  getPlantDiseases: () =>
    apiClient.get<PlantDisease[]>('/plant-diseases'),
  
  detectDisease: (imageData: FormData) =>
    apiClient.post<PlantDisease>('/plant-diseases/detect', imageData),
  
  getPlantDisease: (id: number) =>
    apiClient.get<PlantDisease>(`/plant-diseases/${id}`),
  
  updateTreatmentStatus: (id: number, status: string) =>
    apiClient.put<PlantDisease>(`/plant-diseases/${id}/status`, { status }),
};

export const notificationsApi = {
  getNotifications: () =>
    apiClient.get<Notification[]>('/notifications'),
  
  markAsRead: (id: number) =>
    apiClient.put<{}>(`/notifications/${id}/read`),
  
  markAllAsRead: () =>
    apiClient.put<{}>('/notifications/read-all'),
  
  deleteNotification: (id: number) =>
    apiClient.delete<{}>(`/notifications/${id}`),
};

// Export API client for advanced usage
export { apiClient };

// Error handler utility
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};