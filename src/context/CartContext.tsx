'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import apiService from '../../services/api';
import { useAuth } from './AuthContext';
import { AddToCartResponse } from '../../interface/cart/AddToCartResponse';

interface CartContextType {
  cart: AddToCartResponse | null;
  cartCount: number;
  isLoading: boolean;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, count: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cart: null,
  cartCount: 0,
  isLoading: false,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  refreshCart: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<AddToCartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const cartCount = cart?.numOfCartItems ?? 0;

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    try {
      const data = await apiService.getCart(token);
      setCart(data);
    } catch {
      // ignore
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, refreshCart]);

  const addToCart = useCallback(async (productId: string) => {
    if (!token) {
      toast.error('Please login to add items to cart');
      return;
    }
    setIsLoading(true);
    try {
      const data = await apiService.addProductToCart(productId, token);
      if (data.status === 'success') {
        await refreshCart();
        toast.success('Product added to cart! 🛒');
      } else {
        toast.error('Failed to add product to cart');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const removeFromCart = useCallback(async (itemId: string) => {
    if (!token) return;
    setIsLoading(true);
    try {
      await apiService.removeCartItem(itemId, token);
      await refreshCart();
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const updateQuantity = useCallback(async (itemId: string, count: number) => {
    if (!token) return;
    try {
      await apiService.updateCartItemQuantity(itemId, count, token);
      await refreshCart();
    } catch {
      toast.error('Failed to update quantity');
    }
  }, [token]);

  const clearCart = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      await apiService.clearCart(token);
      setCart(null);
      toast.success('Cart cleared');
    } catch {
      toast.error('Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  return (
    <CartContext.Provider value={{ cart, cartCount, isLoading, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
