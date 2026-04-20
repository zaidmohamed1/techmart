import apiService from '../../../services/api';
import { BrandCard } from '@/components/ui/BrandCard';
import { Award } from 'lucide-react';

export default async function BrandsPage() {
  const brands = await apiService.getBrands();

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Award className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Brands</h1>
          <p className="text-gray-500 text-sm">{brands.length} brands available</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {brands.map((brand) => (
          <BrandCard key={brand._id} brand={brand} />
        ))}
      </div>
    </div>
  );
}
