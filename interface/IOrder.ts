import { IProduct } from './IProduct';

export interface IOrderItem {
  product: IProduct;
  count: number;
  price: number;
  _id: string;
}

export interface IShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface IOrder {
  _id: string;
  user: { name: string; email: string; phone: string };
  cartItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethodType: 'cash' | 'card';
  totalOrderPrice: number;
  taxPrice: number;
  shippingPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface ICreateOrderPayload {
  shippingAddress: IShippingAddress;
}
