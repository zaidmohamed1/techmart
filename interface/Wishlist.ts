import { Product } from './Product';

export interface WishlistItem extends Product {}

export interface WishlistResponse {
  status: string;
  message: string;
  count: number;
  data: WishlistItem[];
}
