/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { IBrand } from '../../../interface/IBrand';

export function BrandCard({ brand }: { brand: IBrand }) {
  return (
    <Link
      href={`/products?brand=${brand._id}`}
      className="group flex flex-col items-center justify-center gap-3 bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="h-16 w-full flex items-center justify-center overflow-hidden">
        <img
          src={brand.image}
          alt={brand.name}
          className="max-h-14 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <p className="font-medium text-sm text-gray-700 text-center group-hover:text-primary transition-colors">
        {brand.name}
      </p>
    </Link>
  );
}
