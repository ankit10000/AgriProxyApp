import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, AuthResponse, ApiError } from "../services/authApi";

export interface User {
  _id: string;
  name: string;
  username: string;
  addressLine?: string;
  city?: string;
  state?: string;
  pincode?: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    location?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const [userData, token] = await AsyncStorage.multiGet([
        "user",
        "auth_token",
      ]);

      if (userData[1] && token[1]) {
        // We have stored user data and token
        setUser(JSON.parse(userData[1]));

        // Optionally verify token with backend
        try {
          const response = await authApi.getProfile();
          if (response.success && response.data?.user) {
            // Update user data with latest from server
            setUser(response.data.user);
            await AsyncStorage.setItem(
              "user",
              JSON.stringify(response.data.user)
            );
          }
        } catch (error) {
          // Token might be expired, clear storage
          console.log("Token verification failed, clearing storage");
          await AsyncStorage.multiRemove(["user", "auth_token"]);
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await authApi.login({ email, password });

      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return true;
      }

      return false;
    } catch (error: any) {
      console.error("Login error:", error);
      // Re-throw error so UI can handle it
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    location?: string;
  }): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await authApi.signup(userData);

      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return true;
      }

      return false;
    } catch (error: any) {
      console.error("Signup error:", error);
      // Re-throw error so UI can handle it
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state and storage
      await AsyncStorage.multiRemove(["user", "auth_token"]);
      setUser(null);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      if (user) {
        const updateData = {
          name: userData.name,
          phone: userData.phone,
          location: userData.location,
        };

        const response = await authApi.updateProfile(updateData);

        if (response.success && response.data?.user) {
          setUser(response.data.user);
        }
      }
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
