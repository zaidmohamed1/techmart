'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Building2,
  CreditCard,
  Banknote,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Package,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '@/lib/utils';
import { PageLoader } from '@/components/ui/SkeletonCard';
import apiService from '../../../services/api';
import { toast } from 'sonner';

type PaymentMethod = 'cash' | 'online';

interface AddressForm {
  details: string;
  city: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading, token } = useAuth();
  const { cart, cartCount, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState<AddressForm>({
    details: '',
    city: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<AddressForm>>({});

  const cartId = searchParams.get('cartId') || cart?.data?._id || '';
  const totalPrice = cart?.data?.totalCartPrice ?? 0;
  const cartItems = cart?.data?.products ?? [];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) return <PageLoader />;

  const validate = () => {
    const errs: Partial<AddressForm> = {};
    if (!formData.details.trim()) errs.details = 'Address details are required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.phone) errs.phone = 'Phone number is required';
    else if (!/^01[0125][0-9]{8}$/.test(formData.phone)) errs.phone = 'Enter a valid Egyptian phone number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!cartId) {
      toast.error('No active cart found. Please add items to cart first.');
      return;
    }
    if (!token) return;

    setIsSubmitting(true);
    try {
      if (paymentMethod === 'cash') {
        const res = await apiService.createCashOrder(cartId, { shippingAddress: formData }, token);
        if (res.status === 'success') {
          await clearCart();
          setOrderSuccess(true);
          toast.success('Order placed successfully! 🎉');
        } else {
          toast.error('Failed to place order. Please try again.');
        }
      } else {
        // Online payment — redirect to Stripe session
        const res = await apiService.createOnlineOrder(cartId, { shippingAddress: formData }, token);
        if (res.session?.url) {
          toast.success('Redirecting to payment gateway...');
          window.location.href = res.session.url;
        } else {
          toast.error('Failed to initiate payment. Please try again.');
        }
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof AddressForm]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const fieldClass = (fieldName: keyof AddressForm) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
      errors[fieldName]
        ? 'border-red-400 bg-red-50'
        : 'border-gray-200 bg-gray-50 focus:border-primary focus:bg-white'
    }`;

  // Order Success Screen
  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Order Confirmed!</h1>
        <p className="text-gray-500 mb-2">
          Thank you for your order. We'll process it right away.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          You'll receive a confirmation soon. Track your order in the orders page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <Package className="h-5 w-5" />
            View My Orders
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Back button */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left — Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
            </div>

            <form onSubmit={handleSubmit} id="checkout-form" className="space-y-4">
              {/* Address Details */}
              <div>
                <label htmlFor="checkout-details" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Address Details
                </label>
                <textarea
                  id="checkout-details"
                  name="details"
                  rows={3}
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="Street, building number, apartment..."
                  className={fieldClass('details')}
                />
                {errors.details && <p className="text-red-500 text-xs mt-1">{errors.details}</p>}
              </div>

              {/* City */}
              <div>
                <label htmlFor="checkout-city" className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Building2 className="h-3.5 w-3.5 inline mr-1" />
                  City
                </label>
                <input
                  id="checkout-city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Cairo, Alexandria"
                  className={fieldClass('city')}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="checkout-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Phone className="h-3.5 w-3.5 inline mr-1" />
                  Phone Number
                </label>
                <input
                  id="checkout-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxx"
                  className={fieldClass('phone')}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </form>
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
            </div>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                htmlFor="payment-cash"
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  id="payment-cash"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  paymentMethod === 'cash' ? 'border-primary' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Banknote className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">Pay when your order arrives</p>
                </div>
              </label>

              {/* Online Payment */}
              <label
                htmlFor="payment-online"
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  id="payment-online"
                  name="payment"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  paymentMethod === 'online' ? 'border-primary' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'online' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Online Payment (Stripe)</p>
                  <p className="text-sm text-gray-500">Pay securely via Stripe checkout</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.imageCover}
                    alt={item.product.title}
                    className="w-12 h-12 object-cover rounded-lg bg-gray-50 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 line-clamp-2">{item.product.title}</p>
                    <p className="text-xs text-gray-400">×{item.count}</p>
                  </div>
                  <p className="text-xs font-semibold text-gray-900 flex-shrink-0">
                    {formatPrice(item.price * item.count)}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm border-t pt-4 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartCount} items)</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (14%)</span>
                <span>{formatPrice(totalPrice * 0.14)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span className="text-primary">{formatPrice(totalPrice * 1.14)}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              id="checkout-submit-btn"
              type="submit"
              form="checkout-form"
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30"
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  {paymentMethod === 'cash' ? 'Place Order' : 'Pay Now'}
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck className="h-3 w-3 text-primary" />
              Secured by 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
