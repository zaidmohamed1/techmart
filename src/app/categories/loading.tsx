import { SkeletonCategoryCard } from '@/components/ui/SkeletonCard';

export default function CategoriesLoading() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="h-10 w-48 rounded-lg skeleton-shimmer mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCategoryCard key={i} />
        ))}
      </div>
    </div>
  );
}
