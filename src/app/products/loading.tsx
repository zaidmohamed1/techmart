import { SkeletonGrid } from '@/components/ui/SkeletonCard';
import { ShoppingBag } from 'lucide-react';

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <ShoppingBag className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="h-6 w-36 rounded skeleton-shimmer mb-1" />
          <div className="h-4 w-24 rounded skeleton-shimmer" />
        </div>
      </div>
      <SkeletonGrid count={12} />
    </div>
  );
}
