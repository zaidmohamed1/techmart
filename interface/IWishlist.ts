import { IProduct } from './IProduct';

export interface IWishlistItem extends IProduct {}

export interface IWishlistResponse {
  status: string;
  message: string;
  count: number;
  data: IWishlistItem[];
}
