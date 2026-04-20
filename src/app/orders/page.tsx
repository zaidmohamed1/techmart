'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  CheckCircle,
  Truck,
  Clock,
  CreditCard,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { PageLoader } from '@/components/ui/SkeletonCard';
import apiService from '../../../services/api';
import { IOrder } from '../../../interface/IOrder';

function StatusBadge({ isPaid, isDelivered }: { isPaid: boolean; isDelivered: boolean }) {
  if (isDelivered) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        <CheckCircle className="h-3 w-3" /> Delivered
      </span>
    );
  }
  if (isPaid) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
        <Truck className="h-3 w-3" /> Paid · On the way
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
      <Clock className="h-3 w-3" /> Pending
    </span>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user, token } = useAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!user?._id || !token) return;
    apiService
      .getUserOrders(user._id, token)
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setPageLoading(false);
      })
      .catch(() => setPageLoading(false));
  }, [user, token]);

  if (authLoading || pageLoading) return <PageLoader />;

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Package className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-12 w-12 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-8">When you place an order, it will appear here</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge isPaid={order.isPaid} isDelivered={order.isDelivered} />
                  <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                    <CreditCard className="h-3 w-3" />
                    {order.paymentMethodType === 'cash' ? 'Cash on Delivery' : 'Online Payment'}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                  {order.cartItems.slice(0, 6).map((item) => (
                    <div key={item._id} className="text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product.imageCover}
                        alt={item.product.title}
                        className="w-full aspect-square object-cover rounded-lg bg-gray-50 mb-2"
                      />
                      <p className="text-xs text-gray-600 line-clamp-2">{item.product.title}</p>
                      <p className="text-xs font-semibold text-primary mt-1">×{item.count}</p>
                    </div>
                  ))}
                  {order.cartItems.length > 6 && (
                    <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-gray-400 font-medium">+{order.cartItems.length - 6} more</p>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{order.cartItems.length} item{order.cartItems.length !== 1 ? 's' : ''}</span>
                    <span>·</span>
                    <span>{order.shippingAddress?.city}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-lg font-bold text-primary">{formatPrice(order.totalOrderPrice)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
