import { Product } from '../interface/Product';
import { Category } from '../interface/Category';
import { Brand } from '../interface/Brand';
import { SubCategory } from '../interface/SubCategory';
import { AuthResponse, LoginPayload, RegisterPayload } from '../interface/Auth';
import { WishlistResponse } from '../interface/Wishlist';
import { Order, CreateOrderPayload } from '../interface/Order';
import { AddToCartResponse } from '../interface/cart/AddToCartResponse';
import { ResponseType } from '../types/Responsetype';

const BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

function getHeaders(token?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const t = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  if (t) {
    headers['token'] = t;
  }
  return headers;
}

class ApiService {
  // ─── Auth ───────────────────────────────────────────────────────────────────
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  // ─── Products ────────────────────────────────────────────────────────────────
  async getProducts(brandId?: string): Promise<Product[]> {
    let url = `${BASE_URL}/products?limit=40`;
    if (brandId) {
      url += `&brand=${brandId}`;
    }
    const res = await fetch(url);
    const data: ResponseType<Product> = await res.json();
    return data.data;
  }

  async getProductDetails(productID: string): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${productID}`);
    const product = await res.json();
    return product.data;
  }

  // ─── Categories ──────────────────────────────────────────────────────────────
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${BASE_URL}/categories`);
    const data: ResponseType<Category> = await res.json();
    return data.data;
  }

  async getCategoryDetails(categoryId: string): Promise<Category> {
    const res = await fetch(`${BASE_URL}/categories/${categoryId}`);
    const data = await res.json();
    return data.data;
  }

  async getSubcategoriesOnCategory(categoryId: string): Promise<SubCategory[]> {
    const res = await fetch(`${BASE_URL}/categories/${categoryId}/subcategories`);
    const data = await res.json();
    return data.data;
  }

  // ─── Brands ──────────────────────────────────────────────────────────────────
  async getBrands(): Promise<Brand[]> {
    const res = await fetch(`${BASE_URL}/brands`);
    const data: ResponseType<Brand> = await res.json();
    return data.data;
  }

  async getBrandDetails(brandId: string): Promise<Brand> {
    const res = await fetch(`${BASE_URL}/brands/${brandId}`);
    const data = await res.json();
    return data.data;
  }

  // ─── Cart ────────────────────────────────────────────────────────────────────
  async getCart(token?: string): Promise<AddToCartResponse> {
    const res = await fetch(`${BASE_URL}/cart`, {
      headers: getHeaders(token),
    });
    return res.json();
  }

  async addProductToCart(productID: string, token?: string): Promise<AddToCartResponse> {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ productId: productID }),
    });
    return res.json();
  }

  async updateCartItemQuantity(itemId: string, count: number, token?: string): Promise<AddToCartResponse> {
    const res = await fetch(`${BASE_URL}/cart/${itemId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ count }),
    });
    return res.json();
  }

  async removeCartItem(itemId: string, token?: string): Promise<AddToCartResponse> {
    const res = await fetch(`${BASE_URL}/cart/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return res.json();
  }

  async clearCart(token?: string): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return res.json();
  }

  // ─── Wishlist ────────────────────────────────────────────────────────────────
  async getWishlist(token?: string): Promise<WishlistResponse> {
    const res = await fetch(`${BASE_URL}/wishlist`, {
      headers: getHeaders(token),
    });
    return res.json();
  }

  async addToWishlist(productId: string, token?: string): Promise<WishlistResponse> {
    const res = await fetch(`${BASE_URL}/wishlist`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ productId }),
    });
    return res.json();
  }

  async removeFromWishlist(productId: string, token?: string): Promise<WishlistResponse> {
    const res = await fetch(`${BASE_URL}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return res.json();
  }

  // ─── Orders ──────────────────────────────────────────────────────────────────
  async getUserOrders(userId: string, token?: string): Promise<Order[]> {
    const res = await fetch(`${BASE_URL}/orders/user/${userId}`, {
      headers: getHeaders(token),
    });
    return res.json();
  }

  async createCashOrder(cartId: string, payload: CreateOrderPayload, token?: string): Promise<{ status: string; data: Order }> {
    const res = await fetch(`${BASE_URL}/orders/${cartId}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  async createOnlineOrder(cartId: string, payload: CreateOrderPayload, token?: string): Promise<{ status: string; session: { url: string } }> {
    const res = await fetch(
      `${BASE_URL}/orders/checkout-session/${cartId}?url=${typeof window !== 'undefined' ? window.location.origin : ''}`,
      {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(payload),
      }
    );
    return res.json();
  }
}

const apiService = new ApiService();
export default apiService;