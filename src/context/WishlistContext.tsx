'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import apiService from '../../services/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistIds: string[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: [],
  isInWishlist: () => false,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  toggleWishlist: async () => {},
  refreshWishlist: async () => {},
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    try {
      const data = await apiService.getWishlist(token);
      if (data.data) {
        setWishlistIds(data.data.map((p) => p._id));
      }
    } catch {
      // ignore
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshWishlist();
    } else {
      setWishlistIds([]);
    }
  }, [isAuthenticated, refreshWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistIds.includes(productId);
  }, [wishlistIds]);

  const addToWishlist = useCallback(async (productId: string) => {
    if (!token) {
      toast.error('Please login to add to wishlist');
      return;
    }
    try {
      const data = await apiService.addToWishlist(productId, token);
      if (data.status === 'success') {
        setWishlistIds(data.data.map((p) => p._id));
        toast.success('Added to wishlist ❤️');
      }
    } catch {
      toast.error('Failed to add to wishlist');
    }
  }, [token]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!token) return;
    try {
      const data = await apiService.removeFromWishlist(productId, token);
      if (data.status === 'success') {
        setWishlistIds(data.data.map((p) => p._id));
        toast.success('Removed from wishlist');
      }
    } catch {
      toast.error('Failed to remove from wishlist');
    }
  }, [token]);

  const toggleWishlist = useCallback(async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  return (
    <WishlistContext.Provider value={{ wishlistIds, isInWishlist, addToWishlist, removeFromWishlist, toggleWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
