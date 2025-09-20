import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG, REQUEST_CONFIG } from "../config/api";

// Get current API configuration
const currentConfig = API_CONFIG.getCurrent();

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: currentConfig.BASE_URL,
  timeout: currentConfig.TIMEOUT,
  headers: REQUEST_CONFIG.HEADERS,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Error getting token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear stored data
      await AsyncStorage.multiRemove(["auth_token", "user"]);
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  data?: {
    user: {
      _id: string;
      name: string;
      username: string;
      addressLine?: string;
      city?: string;
      state?: string;
      pincode?: string;
      email: string;
      phone?: string;
      avatar?: string;
      role: string;
      isActive: boolean;
      emailVerified: boolean;
      profileCompleted: boolean;
      createdAt: string;
      updatedAt: string;
      lastLogin: string;
    };
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field?: string;
    msg: string;
  }>;
}

// Auth API functions
export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      if (response.data.success && response.data.token) {
        // Store token and user data
        await AsyncStorage.setItem("auth_token", response.data.token);
        if (response.data.data?.user) {
          await AsyncStorage.setItem(
            "user",
            JSON.stringify(response.data.data.user)
          );
        }
      }

      return response.data;
    } catch (error: any) {
      console.error("Login API error:", error.response?.data || error.message);
      throw (
        error.response?.data || {
          success: false,
          message: "Network error. Please check your connection.",
        }
      );
    }
  },

  // Register new user
  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.SIGNUP,
        userData
      );

      if (response.data.success && response.data.token) {
        // Store token and user data
        await AsyncStorage.setItem("auth_token", response.data.token);
        if (response.data.data?.user) {
          await AsyncStorage.setItem(
            "user",
            JSON.stringify(response.data.data.user)
          );
        }
      }

      return response.data;
    } catch (error: any) {
      console.error("Signup API error:", error.response?.data || error.message);
      throw (
        error.response?.data || {
          success: false,
          message: "Network error. Please check your connection.",
        }
      );
    }
  },

  // Get user profile
  getProfile: async (): Promise<AuthResponse> => {
    try {
      const response = await apiClient.get<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.PROFILE
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Get profile API error:",
        error.response?.data || error.message
      );
      throw (
        error.response?.data || {
          success: false,
          message: "Failed to get profile.",
        }
      );
    }
  },

  // Update user profile
  updateProfile: async (
    updateData: Partial<SignupRequest>
  ): Promise<AuthResponse> => {
    try {
      const response = await apiClient.put<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.UPDATE_PROFILE,
        updateData
      );

      if (response.data.success && response.data.data?.user) {
        // Update stored user data
        await AsyncStorage.setItem(
          "user",
          JSON.stringify(response.data.data.user)
        );
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "Update profile API error:",
        error.response?.data || error.message
      );
      throw (
        error.response?.data || {
          success: false,
          message: "Failed to update profile.",
        }
      );
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.log("Logout API error (non-critical):", error);
    } finally {
      // Always clear local storage
      await AsyncStorage.multiRemove(["auth_token", "user"]);
    }
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      return !!token;
    } catch (error) {
      return false;
    }
  },
};

export default authApi;
