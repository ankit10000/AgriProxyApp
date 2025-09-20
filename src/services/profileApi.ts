import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';

// Get current API configuration
const currentConfig = API_CONFIG.getCurrent();

// Create axios instance for profile APIs
const profileApiClient = axios.create({
  baseURL: currentConfig.BASE_URL,
  timeout: currentConfig.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
profileApiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
profileApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear stored data
      await AsyncStorage.multiRemove(['auth_token', 'user']);
    }
    return Promise.reject(error);
  }
);

export interface ProfileUpdateRequest {
  name?: string;
  phone?: string;
  location?: string;
  username?: string;
  addressLine?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      _id: string;
      name: string;
      email: string;
      phone?: string;
      location?: string;
      avatar?: string;
      role: string;
      isActive: boolean;
      emailVerified: boolean;
      profileCompleted: boolean;
      username?: string;
      addressLine?: string;
      city?: string;
      state?: string;
      pincode?: string;
      profileCompletion?: number;
      createdAt: string;
      updatedAt: string;
      lastLogin: string;
    };
  };
}

export interface AvatarUploadResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    avatarUrl: string;
  };
}

// Profile API functions
export const profileApi = {
  // Get user profile with completion percentage
  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const response = await profileApiClient.get<ProfileResponse>('/profile');

      if (response.data.success && response.data.data?.user) {
        // Update stored user data
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: any) {
      console.error('Get profile API error:', error.response?.data || error.message);
      throw error.response?.data || {
        success: false,
        message: 'Failed to get profile data.'
      };
    }
  },

  // Update user profile with extended fields
  updateProfile: async (updateData: ProfileUpdateRequest): Promise<ProfileResponse> => {
    try {
      const response = await profileApiClient.put<ProfileResponse>('/profile', updateData);

      if (response.data.success && response.data.data?.user) {
        // Update stored user data
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: any) {
      console.error('Update profile API error:', error.response?.data || error.message);
      throw error.response?.data || {
        success: false,
        message: 'Failed to update profile.'
      };
    }
  },

  // Upload profile avatar image
  uploadAvatar: async (imageUri: string): Promise<AvatarUploadResponse> => {
    try {
      const formData = new FormData();

      // Create file object for upload
      const fileExtension = imageUri.split('.').pop() || 'jpg';
      const fileName = `avatar_${Date.now()}.${fileExtension}`;

      formData.append('avatar', {
        uri: imageUri,
        type: `image/${fileExtension}`,
        name: fileName,
      } as any);

      const response = await profileApiClient.post<AvatarUploadResponse>(
        '/profile/avatar',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success && response.data.data?.user) {
        // Update stored user data
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: any) {
      console.error('Upload avatar API error:', error.response?.data || error.message);
      throw error.response?.data || {
        success: false,
        message: 'Failed to upload avatar.'
      };
    }
  },

  // Delete profile avatar
  deleteAvatar: async (): Promise<ProfileResponse> => {
    try {
      const response = await profileApiClient.delete<ProfileResponse>('/profile/avatar');

      if (response.data.success && response.data.data?.user) {
        // Update stored user data
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: any) {
      console.error('Delete avatar API error:', error.response?.data || error.message);
      throw error.response?.data || {
        success: false,
        message: 'Failed to delete avatar.'
      };
    }
  },

  // Change user password
  changePassword: async (passwordData: PasswordChangeRequest): Promise<ProfileResponse> => {
    try {
      const { confirmPassword, ...requestData } = passwordData;
      const response = await profileApiClient.put<ProfileResponse>('/profile/password', requestData);
      return response.data;
    } catch (error: any) {
      console.error('Change password API error:', error.response?.data || error.message);
      throw error.response?.data || {
        success: false,
        message: 'Failed to change password.'
      };
    }
  },

  // Delete user account
  deleteAccount: async (password: string): Promise<ProfileResponse> => {
    try {
      const response = await profileApiClient.delete<ProfileResponse>('/profile/account', {
        data: { password }
      });

      // Clear all stored data after account deletion
      await AsyncStorage.multiRemove(['auth_token', 'user']);

      return response.data;
    } catch (error: any) {
      console.error('Delete account API error:', error.response?.data || error.message);
      throw error.response?.data || {
        success: false,
        message: 'Failed to delete account.'
      };
    }
  },

  // Get avatar URL with base URL
  getAvatarUrl: (avatarPath?: string): string | null => {
    if (!avatarPath) return null;

    // If it's already a full URL, return as is
    if (avatarPath.startsWith('http')) {
      return avatarPath;
    }

    // Construct full URL
    return `${currentConfig.BASE_URL.replace('/api', '')}${avatarPath}`;
  }
};

export default profileApi;