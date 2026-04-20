import apiService from '../../../../services/api';
import Link from 'next/link';
import { ArrowLeft, Folder, PackageX } from 'lucide-react';

export default async function CategorySubcategoriesPage(props: { params: Promise<{ categoryId: string }> }) {
  const params = await props.params;
  const categoryId = params.categoryId;

  // Fetch both category details and subcategories in parallel
  const [category, subcategories] = await Promise.all([
    apiService.getCategoryDetails(categoryId).catch(() => null),
    apiService.getSubcategoriesOnCategory(categoryId).catch(() => []),
  ]);

  const categoryName = category?.name || 'Category';

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Back button */}
      <Link
        href="/categories"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Categories
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {subcategories.length} Subcategories in {categoryName}
        </h1>
      </div>

      {/* Grid or Empty State */}
      {subcategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subcategories.map((sub) => (
            <div
              key={sub._id}
              className="flex items-center gap-3 bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Folder className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
                {sub.name}
              </h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <PackageX className="h-10 w-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Subcategories Found</h2>
          <p className="text-gray-500 mb-8">
            This category currently has no subcategories.
          </p>
        </div>
      )}
    </div>
  );
}
