import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Product, CartItem, Crop, Notification, SoilTest, PlantDisease } from '../types';

// Initial State
interface AppState {
  user: User;
  crops: Crop[];
  products: Product[];
  cart: CartItem[];
  favorites: number[];
  notifications: Notification[];
  soilTests: SoilTest[];
  plantDiseases: PlantDisease[];
  loading: boolean;
  error: string | null;
}

// Actions
type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'TOGGLE_FAVORITE'; payload: number }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'ADD_SOIL_TEST'; payload: SoilTest }
  | { type: 'UPDATE_SOIL_TEST'; payload: SoilTest }
  | { type: 'ADD_PLANT_DISEASE'; payload: PlantDisease }
  | { type: 'UPDATE_PLANT_DISEASE'; payload: PlantDisease }
  | { type: 'MARK_NOTIFICATION_READ'; payload: number };

// Initial state
const initialState: AppState = {
  user: {
    id: '1',
    name: 'Rajesh Kumar',
    location: 'Jaipur, Rajasthan',
    memberSince: 'Jan 2023',
    totalArea: '25 Acres',
    crops: ['Wheat', 'Rice', 'Cotton'],
    isPremium: true,
  },
  crops: [
    { id: 1, name: 'Wheat', planted: '2025-01-15', area: '10 acres', status: 'Growing', progress: 60 },
    { id: 2, name: 'Rice', planted: '2024-12-20', area: '15 acres', status: 'Harvest Ready', progress: 95 }
  ],
  products: [
    { id: 1, name: 'Copper Fungicide', category: 'Fungicides', price: 1850, rating: 4.6, inStock: true },
    { id: 2, name: 'Glyphosate 41%', category: 'Herbicides', price: 950, rating: 4.3, inStock: true },
    { id: 3, name: 'Neem Oil', category: 'Biopesticides', price: 1250, rating: 4.8, inStock: true },
    { id: 4, name: 'NPK 19:19:19', category: 'Fertilizers', price: 2100, rating: 4.5, inStock: false },
    { id: 5, name: 'Mancozeb 75%', category: 'Fungicides', price: 1450, rating: 4.4, inStock: true },
    { id: 6, name: '2,4-D Amine', category: 'Herbicides', price: 750, rating: 4.2, inStock: true }
  ],
  cart: [],
  favorites: [],
  notifications: [
    { id: 1, title: 'Soil Test Ready', message: 'Your soil test results are now available', time: '2 hours ago', read: false, type: 'success' },
    { id: 2, title: 'Weather Alert', message: 'Heavy rain expected in next 24 hours', time: '1 day ago', read: false, type: 'warning' },
    { id: 3, title: 'Pest Alert', message: 'Aphid outbreak reported in your area', time: '2 days ago', read: true, type: 'error' }
  ],
  soilTests: [
    { 
      id: 1, 
      date: '2025-01-20', 
      status: 'completed', 
      ph: 6.8, 
      nitrogen: 'Medium', 
      phosphorus: 'High', 
      potassium: 'Low',
      recommendations: ['Add potassium fertilizer', 'Maintain current pH level', 'Good nitrogen content']
    },
    { 
      id: 2, 
      date: '2025-01-15', 
      status: 'processing', 
      recommendations: []
    }
  ],
  plantDiseases: [
    {
      id: 1,
      date: '2025-01-18',
      crop: 'Wheat',
      disease: 'Leaf Rust',
      severity: 'Moderate',
      confidence: 85,
      treatment: 'Apply fungicide spray',
      status: 'identified'
    },
    {
      id: 2,
      date: '2025-01-16',
      crop: 'Rice',
      disease: 'Bacterial Blight',
      severity: 'High',
      confidence: 92,
      treatment: 'Use copper-based bactericide',
      status: 'treated'
    }
  ],
  loading: false,
  error: null,
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    
    case 'TOGGLE_FAVORITE':
      const isFavorite = state.favorites.includes(action.payload);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload]
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    case 'ADD_SOIL_TEST':
      return {
        ...state,
        soilTests: [action.payload, ...state.soilTests]
      };
    
    case 'UPDATE_SOIL_TEST':
      return {
        ...state,
        soilTests: state.soilTests.map(test =>
          test.id === action.payload.id ? action.payload : test
        )
      };
    
    case 'ADD_PLANT_DISEASE':
      return {
        ...state,
        plantDiseases: [action.payload, ...state.plantDiseases]
      };
    
    case 'UPDATE_PLANT_DISEASE':
      return {
        ...state,
        plantDiseases: state.plantDiseases.map(disease =>
          disease.id === action.payload.id ? action.payload : disease
        )
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        )
      };
    
    default:
      return state;
  }
};

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  toggleFavorite: (productId: number) => void;
  updateUser: (userData: Partial<User>) => void;
  addSoilTest: (test: SoilTest) => void;
  addPlantDisease: (disease: PlantDisease) => void;
  markNotificationRead: (notificationId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const toggleFavorite = (productId: number) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: productId });
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const addSoilTest = (test: SoilTest) => {
    dispatch({ type: 'ADD_SOIL_TEST', payload: test });
  };

  const addPlantDisease = (disease: PlantDisease) => {
    dispatch({ type: 'ADD_PLANT_DISEASE', payload: disease });
  };

  const markNotificationRead = (notificationId: number) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  const value: AppContextType = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    toggleFavorite,
    updateUser,
    addSoilTest,
    addPlantDisease,
    markNotificationRead,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};