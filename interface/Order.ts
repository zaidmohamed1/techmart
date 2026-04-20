import { Product } from './Product';

export interface OrderItem {
  product: Product;
  count: number;
  price: number;
  _id: string;
}

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface Order {
  _id: string;
  user: { name: string; email: string; phone: string };
  cartItems: OrderItem[];
  shippingAddress: ShippingAddress;
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

export interface CreateOrderPayload {
  shippingAddress: ShippingAddress;
}
