import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create an axios instance with default settings
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors more gracefully
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error);
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }
    
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    return Promise.reject(error);
  }
);

export interface UnitPrice {
  _id: string;
  unit: string;
  pricePerUnit: number;
  isBaseUnit: boolean;
  stock?: number;
  equalWith?: number;
}

export interface Store {
  _id: string;
  storeName: string;
  description?: string;
  averageRating?: number;
}

export interface FarmWaste {
  _id: string;
  wasteName: string;
  description?: string;
  averageRating?: number;
  createdAt: string;
  updatedAt: string;
  store: {
    _id: string;
    storeName: string;
  };
  unitPrices: UnitPrice[];
}

export interface CartItem {
  _id: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPriceItem: number;
  farmWaste: {
    _id: string;
    wasteName: string;
    description?: string;
  };
  store: {
    _id: string;
    storeName: string;
  };
  unitPrice: {
    _id: string;
    unit: string;
    isBaseUnit: boolean;
    equalWith?: number;
  };
}

export interface Cart {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
  totalPrice: number;
  itemCount: number;
}

// Farm Waste API calls
export const getFarmWastes = async (): Promise<FarmWaste[]> => {
  try {
    const response = await api.get('/farm-wastes');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching farm wastes:', error);
    throw error;
  }
};

export const getFarmWasteById = async (id: string): Promise<FarmWaste> => {
  try {
    const response = await api.get(`/farm-wastes/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching farm waste with ID ${id}:`, error);
    throw error;
  }
};

// Store API calls
export const getStores = async (): Promise<Store[]> => {
  try {
    const response = await api.get('/stores');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};

export const getStoreById = async (id: string): Promise<Store> => {
  try {
    const response = await api.get(`/stores/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching store with ID ${id}:`, error);
    throw error;
  }
};

export const getStoreProducts = async (id: string): Promise<{ store: Store; products: FarmWaste[] }> => {
  try {
    const response = await api.get(`/stores/${id}/products`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching products for store with ID ${id}:`, error);
    throw error;
  }
};

// Cart API calls
export const getUserCart = async (userId: string): Promise<Cart> => {
  try {
    const response = await api.get(`/cart/user/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching cart for user with ID ${userId}:`, error);
    throw error;
  }
};

export const addItemToCart = async (userId: string, farmWasteId: string, unitsPriceId: string, quantity: number) => {
  try {
    const response = await api.post('/cart/user/' + userId + '/add', {
      farmWasteId,
      unitsPriceId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  try {
    const response = await api.put('/cart/item/' + itemId, {
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeCartItem = async (itemId: string) => {
  try {
    const response = await api.delete('/cart/item/' + itemId);
    return response.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

export const clearCart = async (userId: string) => {
  try {
    const response = await api.delete('/cart/user/' + userId + '/clear');
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}; 