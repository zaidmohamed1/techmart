import apiService from '../../../services/api';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { Tag } from 'lucide-react';

export default async function CategoriesPage() {
  const categories = await apiService.getCategories();

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Tag className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Categories</h1>
          <p className="text-gray-500 text-sm">{categories.length} categories available</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    </div>
  );
}
