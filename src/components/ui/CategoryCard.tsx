/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { ICategory } from '../../../interface/ICategory';

export function CategoryCard({ category }: { category: ICategory }) {
  return (
    <Link
      href={`/categories/${category._id}`}
      className="group block bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-3 text-center">
        <h3 className="font-semibold text-sm text-gray-800 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
