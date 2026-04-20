'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Heart,
  Package,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { useCart } from '../../../../context/CartContext';
import { useWishlist } from '../../../../context/WishlistContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/brands', label: 'Brands' },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistIds } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out. See you soon! 👋');
    router.push('/');
    setMobileOpen(false);
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
      <div className="container mx-auto">
        <nav className="flex items-center justify-between h-16 px-4">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-blue-200">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-800">
              Shop<span className="text-blue-600">Vibe</span>
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden lg:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive(link.href)
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Desktop right ── */}
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  className="relative p-2 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-all"
                  title="Wishlist"
                >
                  <Heart
                    className={cn(
                      'h-5 w-5',
                      isActive('/wishlist') && 'text-rose-500 fill-rose-500'
                    )}
                  />
                  {wishlistIds.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {wishlistIds.length > 9 ? '9+' : wishlistIds.length}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  href="/cart"
                  className="relative p-2 rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  title="Cart"
                >
                  <ShoppingCart
                    className={cn('h-5 w-5', isActive('/cart') && 'text-blue-600')}
                  />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>

                {/* Orders */}
                <Link
                  href="/orders"
                  className="p-2 rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  title="Orders"
                >
                  <Package
                    className={cn('h-5 w-5', isActive('/orders') && 'text-blue-600')}
                  />
                </Link>

                {/* User + Logout */}
                <div className="flex items-center gap-2 ml-2 pl-3 border-l border-slate-200">
                  <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-700">
                      {user?.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-slate-600 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-rose-500 hover:bg-rose-50 transition-colors font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-200 hover:shadow-blue-300"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <div className="border-t border-slate-100 pt-3 mt-3 space-y-1">
                  <Link href="/wishlist" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                    <Heart className="h-4 w-4" />
                    Wishlist
                    {wishlistIds.length > 0 && (
                      <span className="ml-auto bg-rose-100 text-rose-600 text-xs px-2 py-0.5 rounded-full">{wishlistIds.length}</span>
                    )}
                  </Link>
                  <Link href="/cart" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                    {cartCount > 0 && (
                      <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">{cartCount}</span>
                    )}
                  </Link>
                  <Link href="/orders" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                    <Package className="h-4 w-4" />
                    My Orders
                  </Link>
                </div>
                <div className="border-t border-slate-100 pt-3 mt-3">
                  <div className="px-4 py-2 text-xs text-slate-400">
                    Signed in as <strong className="text-slate-600">{user?.name}</strong>
                  </div>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-slate-100 pt-3 mt-3 space-y-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export { Navbar };
