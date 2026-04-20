import type { Category } from '../Category';
import type { Brand } from '../Brand';
import type { SubCategory } from '../SubCategory';

export interface CartProduct {
  count: number;
  _id: string;
  product: Product;
  price: number;
}
interface Product {
  _id: string;
  id: string;
  title: string;
  slug: string;
  quantity: number;
  imageCover: string;
  category: Category;
  brand: Brand;
  subcategory: SubCategory[];
  ratingsAverage: number;
}