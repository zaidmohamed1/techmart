'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UserPlus, Eye, EyeOff, Leaf, Loader2 } from 'lucide-react';
import apiService from '../../../services/api';
import { useAuth } from '../../context/AuthContext';

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  rePassword: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    rePassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = () => {
    const errs: Partial<FormData> = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    else if (formData.name.trim().length < 3) errs.name = 'Name must be at least 3 characters';

    if (!formData.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email address';

    if (!formData.phone) errs.phone = 'Phone is required';
    else if (!/^01[0125][0-9]{8}$/.test(formData.phone)) errs.phone = 'Enter a valid Egyptian phone number';

    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';

    if (!formData.rePassword) errs.rePassword = 'Please confirm your password';
    else if (formData.rePassword !== formData.password) errs.rePassword = 'Passwords do not match';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await apiService.register(formData);
      if (res.token && res.user) {
        login(res.token, res.user);
        toast.success(`Account created! Welcome, ${res.user.name}! 🎉`);
        router.push('/');
      } else {
        toast.error(res.message || 'Registration failed. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const fieldClass = (fieldName: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
      errors[fieldName]
        ? 'border-red-400 bg-red-50'
        : 'border-gray-200 bg-gray-50 focus:border-primary focus:bg-white'
    }`;

  return (
    <div className="min-h-screen flex">
      {/* Left — Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-emerald-500 to-teal-600 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute bottom-20 left-20 w-60 h-60 bg-white/10 rounded-full" />
        </div>
        <div className="relative text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Leaf className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold mb-4">Join TechMart!</h2>
          <p className="text-white/80 text-lg max-w-sm mx-auto leading-relaxed">
            Create your account and start shopping thousands of products today.
          </p>
          <div className="mt-8 space-y-3">
            {[
              '✓ Free delivery on your first order',
              '✓ Exclusive member-only deals',
              '✓ Easy returns & refunds',
              '✓ 24/7 customer support',
            ].map((benefit) => (
              <p key={benefit} className="text-white/90 text-sm">{benefit}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Tech<span className="text-primary">Mart</span></span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
              <p className="text-gray-500 mt-1">Join thousands of happy shoppers</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" id="signup-form">
              {/* Name */}
              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={fieldClass('name')}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={fieldClass('email')}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  id="signup-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxx"
                  className={fieldClass('phone')}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={fieldClass('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    id="signup-toggle-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="signup-repassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="signup-repassword"
                    name="rePassword"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.rePassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={fieldClass('rePassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    id="signup-toggle-confirm"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.rePassword && <p className="text-red-500 text-xs mt-1">{errors.rePassword}</p>}
              </div>

              {/* Submit */}
              <button
                id="signup-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30 mt-2"
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Creating Account...</>
                ) : (
                  <><UserPlus className="h-4 w-4" /> Create Account</>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
