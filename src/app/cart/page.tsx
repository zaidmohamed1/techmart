'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShoppingCart as CartIcon,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '@/lib/utils';
import { PageLoader } from '@/components/ui/SkeletonCard';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { cart, cartCount, removeFromCart, updateQuantity, clearCart } = useCart();

  // Per-item loading maps
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const [removingItems, setRemovingItems] = useState<Record<string, boolean>>({});
  const [clearingCart, setClearingCart] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || (!isAuthenticated && !authLoading)) return <PageLoader />;

  const cartItems = cart?.data?.products ?? [];
  const totalPrice = cart?.data?.totalCartPrice ?? 0;
  const cartId = cart?.data?._id;

  const handleUpdateQuantity = async (itemId: string, newCount: number) => {
    setLoadingItems(prev => ({ ...prev, [itemId]: true }));
    await updateQuantity(itemId, newCount);
    setLoadingItems(prev => ({ ...prev, [itemId]: false }));
  };

  const handleDecrease = async (itemId: string, currentCount: number) => {
    setLoadingItems(prev => ({ ...prev, [itemId]: true }));
    if (currentCount > 1) {
      await updateQuantity(itemId, currentCount - 1);
    } else {
      await removeFromCart(itemId);
    }
    setLoadingItems(prev => ({ ...prev, [itemId]: false }));
  };

  const handleIncrease = async (itemId: string, currentCount: number) => {
    await handleUpdateQuantity(itemId, currentCount + 1);
  };

  const handleRemove = async (itemId: string) => {
    setRemovingItems(prev => ({ ...prev, [itemId]: true }));
    await removeFromCart(itemId);
    setRemovingItems(prev => ({ ...prev, [itemId]: false }));
  };

  const handleClearCart = async () => {
    setClearingCart(true);
    await clearCart();
    setClearingCart(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CartIcon className="h-14 w-14 text-blue-300" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h1>
        <p className="text-slate-500 mb-8">Looks like you haven't added anything yet</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          <ShoppingBag className="h-5 w-5" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Shopping Cart</h1>
            <p className="text-slate-500 text-sm mt-1">
              {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <button
            onClick={handleClearCart}
            disabled={clearingCart}
            className="flex items-center gap-2 text-sm text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
            id="cart-clear-btn"
          >
            {clearingCart ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const isItemLoading = loadingItems[item.product._id];
              const isRemoving = removingItems[item.product._id];
              return (
                <div
                  key={item._id}
                  className={`bg-white rounded-2xl border border-slate-100 p-4 flex gap-4 shadow-sm transition-all duration-200 ${
                    isRemoving ? 'opacity-50 scale-95' : 'hover:shadow-md hover:border-blue-100'
                  }`}
                >
                  {/* Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.imageCover}
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded-xl bg-slate-50 flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2">
                      {item.product.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      {item.product.category?.name}
                    </p>

                    <div className="flex items-center justify-between flex-wrap gap-3">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
                        <button
                          onClick={() => handleDecrease(item.product._id, item.count)}
                          disabled={isItemLoading}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-600 disabled:opacity-40"
                          id={`cart-decrease-${item._id}`}
                          aria-label="Decrease quantity"
                        >
                          {isItemLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                          ) : (
                            <Minus className="h-3 w-3" />
                          )}
                        </button>

                        <span className="w-8 text-center text-sm font-bold text-slate-800 select-none">
                          {isItemLoading ? (
                            <span className="text-blue-400">·</span>
                          ) : (
                            item.count
                          )}
                        </span>

                        <button
                          onClick={() => handleIncrease(item.product._id, item.count)}
                          disabled={isItemLoading}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-600 disabled:opacity-40"
                          id={`cart-increase-${item._id}`}
                          aria-label="Increase quantity"
                        >
                          {isItemLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                          ) : (
                            <Plus className="h-3 w-3" />
                          )}
                        </button>
                      </div>

                      {/* Price & Delete */}
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-blue-600 text-base">
                          {formatPrice(item.price * item.count)}
                        </span>
                        <button
                          onClick={() => handleRemove(item.product._id)}
                          disabled={isRemoving}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-40"
                          id={`cart-remove-${item._id}`}
                          aria-label="Remove item"
                        >
                          {isRemoving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-emerald-500 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (14%)</span>
                  <span className="font-medium">{formatPrice(totalPrice * 0.14)}</span>
                </div>
                <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between font-bold text-slate-800 text-base">
                  <span>Total</span>
                  <span className="text-blue-600 text-lg">{formatPrice(totalPrice * 1.14)}</span>
                </div>
              </div>

              <Link
                href={cartId ? `/checkout?cartId=${cartId}` : '/checkout'}
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200 active:scale-95"
                id="cart-checkout-btn"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/products"
                className="flex items-center justify-center gap-2 w-full mt-3 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
