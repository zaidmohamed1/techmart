import apiService from '../../services/api';
import ProductCard from '@/components/ui/ProductCard';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { BrandCard } from '@/components/ui/BrandCard';
import Link from 'next/link';
import {
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Star,
  Zap,
  Clock,
} from 'lucide-react';

const features = [
  { icon: Truck,     title: 'Free Delivery',   desc: 'On orders over 500 EGP',      color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Shield,    title: 'Secure Payment',  desc: '100% secure transactions',     color: 'text-violet-600', bg: 'bg-violet-50' },
  { icon: RotateCcw, title: 'Easy Returns',    desc: '30-day return policy',         color: 'text-rose-500',   bg: 'bg-rose-50' },
  { icon: Clock,     title: 'Fast Support',    desc: '24/7 customer service',        color: 'text-amber-500',  bg: 'bg-amber-50' },
];

export default async function Home() {
  const [products, categories, brands] = await Promise.all([
    apiService.getProducts(),
    apiService.getCategories(),
    apiService.getBrands(),
  ]);

  const featuredProducts   = products.slice(0, 10);
  const featuredCategories = categories.slice(0, 8);
  const featuredBrands     = brands.slice(0, 8);

  return (
    <div className="pb-16">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950 text-white">
        {/* decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-2xl" />
        </div>

        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20">
              <Zap className="h-4 w-4 text-amber-400" />
              New Arrivals Every Day
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Discover Your
              <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Perfect Vibe
              </span>
            </h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Thousands of quality products across every category.
              The best prices, fastest delivery, and a seamless experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-8 py-3.5 rounded-xl font-semibold transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95"
              >
                <ShoppingBag className="h-5 w-5" />
                Shop Now
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 border border-white/30 text-white/90 px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Browse Categories
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-10 pt-10 border-t border-white/10">
              {[
                { num: '50K+',  label: 'Products' },
                { num: '100K+', label: 'Happy Customers' },
                { num: '4.8★',  label: 'Rating' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.num}</div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Strip ───────────────────────────────── */}
      <section className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className={`flex items-center gap-3 p-4 ${f.bg} rounded-2xl border border-white shadow-sm`}
            >
              <div className={`${f.color} flex-shrink-0`}>
                <f.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{f.title}</p>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="container mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Shop by Category</h2>
            <p className="text-slate-500 text-sm mt-1">Explore our wide range of categories</p>
          </div>
          <Link href="/categories" className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {featuredCategories.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────── */}
      <section className="container mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Featured Products</h2>
            <p className="text-slate-500 text-sm mt-1">Handpicked products just for you</p>
          </div>
          <Link href="/products" className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ── Promo Banner ─────────────────────────────────── */}
      <section className="container mx-auto px-4 mt-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full" />
            <div className="absolute top-8 right-1/3 w-3 h-3 bg-white/30 rounded-full" />
            <div className="absolute bottom-8 left-1/3 w-5 h-5 bg-white/20 rounded-full" />
          </div>
          <div className="relative max-w-lg">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-3">
              <Star className="h-3 w-3 text-amber-300 fill-amber-300" />
              Limited Time Offer
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              Get 20% OFF Your First Order
            </h2>
            <p className="text-white/80 mb-6">
              Sign up today and unlock exclusive deals on thousands of products.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-xl"
            >
              Claim Your Discount
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Brands ───────────────────────────────────────── */}
      <section className="container mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Top Brands</h2>
            <p className="text-slate-500 text-sm mt-1">Browse products from your favourite brands</p>
          </div>
          <Link href="/brands" className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {featuredBrands.map((brand) => (
            <BrandCard key={brand._id} brand={brand} />
          ))}
        </div>
      </section>

      {/* ── All Products ─────────────────────────────────── */}
      <section className="container mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">All Products</h2>
            <p className="text-slate-500 text-sm mt-1">{products.length} products available</p>
          </div>
          <Link href="/products" className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">
            See More <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products.slice(0, 20).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5"
          >
            <ShoppingBag className="h-5 w-5" />
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
