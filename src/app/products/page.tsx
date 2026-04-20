import apiService from '../../../services/api';
import ProductCard from '@/components/ui/ProductCard';
import { ShoppingBag, PackageX, X, Tag } from 'lucide-react';
import Link from 'next/link';

export default async function ProductsPage(props: { searchParams: Promise<{ brand?: string }> }) {
  const searchParams = await props.searchParams;
  const brandId = searchParams.brand;

  const products = await apiService.getProducts(brandId);

  let brandName = '';
  if (brandId) {
    try {
      const brandDetails = await apiService.getBrandDetails(brandId);
      brandName = brandDetails.name;
    } catch {
      // Ignore if brand not found
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
            <p className="text-gray-500 text-sm mt-1">Showing {products.length} products</p>
          </div>
        </div>

        {/* Active Filters */}
        {brandId && brandName && (
          <div className="flex items-center flex-wrap gap-3 text-sm border-b border-gray-100 pb-4">
            <span className="text-gray-500 font-medium">Active Filters:</span>
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium border border-blue-200 shadow-sm">
              <Tag className="h-3.5 w-3.5" />
              {brandName}
              <Link href="/products" className="hover:bg-blue-200 hover:text-blue-900 p-0.5 rounded-full transition-colors ml-1" aria-label="Clear filter">
                <X className="h-3.5 w-3.5" />
              </Link>
            </div>
            <Link href="/products" className="text-slate-500 hover:text-slate-800 underline underline-offset-2 ml-2 transition-colors">
              Clear all
            </Link>
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <PackageX className="h-12 w-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Products Found</h2>
          <p className="text-slate-500 mb-8">
            No products match your current filters.
          </p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
          >
            View All Products
          </Link>
        </div>
      )}
    </div>
  );
}
