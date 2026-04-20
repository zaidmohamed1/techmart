import { IBrand } from './iBrand';
import { ICategory } from './ICategory';
import { ISubCategory } from './iSubcategory';

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

  category: ICategory;
  brand: IBrand;
  subcategory: ISubCategory[];
} 