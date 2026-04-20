import type { ICategory } from '../ICategory';
import type { IBrand } from '../iBrand';
import type { ISubCategory } from '../iSubcategory';

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
  category: ICategory;
  brand: IBrand;
  subcategory: ISubCategory[];
  ratingsAverage: number;
}