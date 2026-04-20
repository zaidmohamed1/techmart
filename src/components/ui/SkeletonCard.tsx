import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <div className="aspect-square skeleton-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-20 rounded skeleton-shimmer" />
        <div className="h-4 w-full rounded skeleton-shimmer" />
        <div className="h-4 w-3/4 rounded skeleton-shimmer" />
        <div className="h-3 w-16 rounded skeleton-shimmer" />
        <div className="flex justify-between items-center mt-2">
          <div className="h-6 w-20 rounded skeleton-shimmer" />
          <div className="h-3 w-12 rounded skeleton-shimmer" />
        </div>
        <div className="h-9 w-full rounded-lg skeleton-shimmer mt-2" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonBrandCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden p-6 flex flex-col items-center gap-3">
      <div className="h-16 w-24 rounded skeleton-shimmer" />
      <div className="h-4 w-20 rounded skeleton-shimmer" />
    </div>
  );
}

export function SkeletonCategoryCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div className="aspect-[4/3] skeleton-shimmer" />
      <div className="p-3">
        <div className="h-4 w-3/4 mx-auto rounded skeleton-shimmer" />
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}
