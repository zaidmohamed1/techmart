/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Loader2, Check } from 'lucide-react';
import Link from 'next/link';
import { Product } from '../../../interface/Product';
import { formatPrice } from '@/lib/utils';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

function renderStars(rating: number) {
  return Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={i}
      className={`h-3 w-3 ${
        i < Math.floor(rating)
          ? 'fill-amber-400 text-amber-400'
          : 'text-gray-200 fill-gray-200'
      }`}
    />
  ));
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  // Per-card local state — prevents global spinner on all cards
  const [cartLoading, setCartLoading] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleAddToCart = async () => {
    if (cartLoading || cartAdded) return;
    setCartLoading(true);
    await addToCart(product._id);
    setCartLoading(false);
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  const handleToggleWishlist = async () => {
    if (wishlistLoading) return;
    setWishlistLoading(true);
    await toggleWishlist(product._id);
    setWishlistLoading(false);
  };

  const hasDiscount =
    product.priceAfterDiscount && product.priceAfterDiscount < product.price;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.imageCover}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          style={{ transform: 'scale(1)' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Wishlist button */}
        <button
          onClick={handleToggleWishlist}
          disabled={wishlistLoading}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
            inWishlist
              ? 'bg-rose-500 text-white scale-110'
              : 'bg-white/90 text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:scale-110'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlistLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Heart className={`h-3.5 w-3.5 ${inWishlist ? 'fill-white' : ''}`} />
          )}
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Sale
            </span>
          )}
          {product.sold > 100 && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Popular
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand */}
        <Link
          href="/brands"
          className="text-[10px] font-semibold tracking-widest uppercase text-blue-400 hover:text-blue-600 transition-colors mb-1"
        >
          {product.brand?.name}
        </Link>

        {/* Title */}
        <h3 className="font-semibold text-sm text-slate-800 leading-snug line-clamp-2 flex-1 mb-2">
          <Link
            href={`/products/${product._id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {product.title}
          </Link>
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">{renderStars(product.ratingsAverage)}</div>
          <span className="text-[11px] text-slate-400">
            ({product.ratingsQuantity})
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-lg font-extrabold text-blue-600">
              {formatPrice(hasDiscount ? product.priceAfterDiscount! : product.price)}
            </span>
            {hasDiscount && (
              <span className="ml-1.5 text-xs text-slate-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400">
            {product.sold > 1000 ? '1k+' : product.sold} sold
          </span>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={cartLoading || cartAdded}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            cartAdded
              ? 'bg-emerald-500 text-white'
              : cartLoading
              ? 'bg-blue-400 text-white cursor-wait'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95'
          }`}
          id={`add-to-cart-${product._id}`}
        >
          {cartLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : cartAdded ? (
            <>
              <Check className="h-4 w-4" />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
