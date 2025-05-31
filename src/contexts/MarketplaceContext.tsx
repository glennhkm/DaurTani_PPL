"use client";


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getFarmWastes, 
  getFarmWasteById, 
  getStores, 
  getUserCart, 
  addItemToCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart,
  FarmWaste,
  Store,
  Cart,
  UnitPrice
} from '@/lib/api/marketplaceApi';

interface MarketplaceContextType {
  farmWastes: FarmWaste[];
  stores: Store[];
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  selectedLocation: string;
  searchQuery: string;
  sortBy: string;
  fetchFarmWastes: () => Promise<FarmWaste[]>;
  fetchStores: () => Promise<Store[]>;
  fetchMarketplaceData: () => Promise<void>;
  fetchCart: (userId: string) => Promise<void>;
  addToCart: (userId: string, farmWasteId: string, unitsPriceId: string, quantity: number) => Promise<void>;
  updateCartItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  emptyCart: (userId: string) => Promise<void>;
  setSelectedLocation: (location: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: string) => void;
  getFilteredAndSortedProducts: () => FarmWaste[];
  getUniqueLocations: () => string[];
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};

interface MarketplaceProviderProps {
  children: ReactNode;
}

export const MarketplaceProvider = ({ children }: MarketplaceProviderProps) => {
  const [farmWastes, setFarmWastes] = useState<FarmWaste[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');

  const fetchFarmWastes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFarmWastes();
      setFarmWastes(data);
      return data;
    } catch (err) {
      setError('Failed to fetch farm wastes');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStores();
      setStores(data);
      return data;
    } catch (err) {
      setError('Failed to fetch stores');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Combined function to fetch both farm wastes and stores
  const fetchMarketplaceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [wastesData, storesData] = await Promise.all([
        getFarmWastes(),
        getStores()
      ]);
      setFarmWastes(wastesData);
      setStores(storesData);
    } catch (err) {
      setError('Failed to fetch marketplace data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserCart(userId);
      
      setCart(data);
    } catch (err) {
      setError('Failed to fetch cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (userId: string, farmWasteId: string, unitsPriceId: string, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      await addItemToCart(userId, farmWasteId, unitsPriceId, quantity);
      // Refresh cart after adding item
      await fetchCart(userId);
    } catch (err) {
      setError('Failed to add item to cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItemQuantity = async (itemId: string, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      await updateCartItem(itemId, quantity);
      // Refresh cart after updating item
      if (cart?.userId) {
        await fetchCart(cart.userId);
      }
    } catch (err) {
      setError('Failed to update cart item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    setLoading(true);
    setError(null);
    try {
      await removeCartItem(itemId);
      // Refresh cart after removing item
      if (cart?.userId) {
        await fetchCart(cart.userId);
      }
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const emptyCart = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await clearCart(userId);
      // Refresh cart after clearing
      await fetchCart(userId);
    } catch (err) {
      setError('Failed to clear cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get the lowest price for a farm waste
  const getLowestPrice = (unitPrices: UnitPrice[]): number => {
    if (!unitPrices || unitPrices.length === 0) return 0;
    return Math.min(...unitPrices.map(up => up.pricePerUnit));
  };

  // Get the highest price for a farm waste
  const getHighestPrice = (unitPrices: UnitPrice[]): number => {
    if (!unitPrices || unitPrices.length === 0) return 0;
    return Math.max(...unitPrices.map(up => up.pricePerUnit));
  };

  // Get total stock for a farm waste
  const getTotalStock = (unitPrices: UnitPrice[]): number => {
    if (!unitPrices || unitPrices.length === 0) return 0;
    
    // Find the base unit
    const baseUnit = unitPrices.find(up => up.isBaseUnit);
    if (!baseUnit) return 0;
    
    // Calculate total stock in base units
    return unitPrices.reduce((total, up) => {
      const stockInBaseUnits = up.isBaseUnit 
        ? (up.stock || 0) 
        : (up.stock || 0) * (up.equalWith || 1);
      return total + stockInBaseUnits;
    }, 0);
  };

  // Get filtered and sorted products
  const getFilteredAndSortedProducts = (): FarmWaste[] => {
    let filtered = [...farmWastes];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(waste => 
        waste.wasteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (waste.description && waste.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply location filter
    if (selectedLocation) {
      filtered = filtered.filter(waste => {
        const store = stores.find(s => s._id === waste.store._id);
        return store?.storeName.includes(selectedLocation);
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return getLowestPrice(a.unitPrices) - getLowestPrice(b.unitPrices);
        case 'price-high':
          return getHighestPrice(b.unitPrices) - getHighestPrice(a.unitPrices);
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'stock':
          return getTotalStock(b.unitPrices) - getTotalStock(a.unitPrices);
        case 'featured':
        default:
          // Sort by rating as default
          return (b.averageRating || 0) - (a.averageRating || 0);
      }
    });
    
    return filtered;
  };

  // Get unique locations from stores
  const getUniqueLocations = (): string[] => {
    const locations = stores.map(store => store.storeName);
    return [...new Set(locations)];
  };

  const value: MarketplaceContextType = {
    farmWastes,
    stores,
    cart,
    loading,
    error,
    selectedLocation,
    searchQuery,
    sortBy,
    fetchFarmWastes,
    fetchStores,
    fetchMarketplaceData,
    fetchCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    emptyCart,
    setSelectedLocation,
    setSearchQuery,
    setSortBy,
    getFilteredAndSortedProducts,
    getUniqueLocations,
  };

  return (
    <MarketplaceContext.Provider
      value={value}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}; 