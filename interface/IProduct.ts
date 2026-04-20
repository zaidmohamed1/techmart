import { Brand } from './iBrand';
import { Category } from './ICategory';
import { SubCategory } from './iSubcategory';

export interface IProduct {
  _id: string;
  id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  priceAfterDiscount?: number;
  sold: number;
  images: string[];
  imageCover: string;
  ratingsQuantity: number;
  ratingsAverage: number;
  createdAt: string;
  updatedAt: string;

  category: Category;
  brand: Brand;
  subcategory: SubCategory[];
} 