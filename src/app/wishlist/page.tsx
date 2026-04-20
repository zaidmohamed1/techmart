'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, HeartOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '@/lib/utils';
import { PageLoader } from '@/components/ui/SkeletonCard';
import apiService from '../../../services/api';
import { Product } from '../../../interface/Product';

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, token } = useAuth();
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    setPageLoading(true);
    apiService.getWishlist(token).then((res) => {
      setProducts(res.data ?? []);
      setPageLoading(false);
    });
  }, [isAuthenticated, token, wishlistIds.length]);

  if (authLoading || pageLoading) return <PageLoader />;

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} saved item{products.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <HeartOff className="h-12 w-12 text-red-200" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Save items you love and come back to them later</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product._id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all group">
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageCover}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-all"
                  aria-label="Remove from wishlist"
                  id={`wishlist-remove-${product._id}`}
                >
                  <Trash2 className="h-4 w-4 text-red-400 hover:text-red-600" />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs text-gray-400 uppercase mb-1">{product.brand?.name}</p>
                <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-3">
                  <Link href={`/products/${product._id}`} className="hover:text-primary transition-colors">
                    {product.title}
                  </Link>
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                </div>
                <button
                  onClick={() => addToCart(product._id)}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                  id={`wishlist-add-cart-${product._id}`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
