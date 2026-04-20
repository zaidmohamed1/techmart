import { IProduct } from '../interface/IProduct';
import { ICategory } from '../interface/ICategory';
import { IBrand } from '../interface/IBrand';
import { ISubCategory } from '../interface/ISubCategory';
import { IAuthResponse, ILoginPayload, IRegisterPayload } from '../interface/IAuth';
import { IWishlistResponse } from '../interface/IWishlist';
import { IOrder, ICreateOrderPayload } from '../interface/IOrder';
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
  async login(payload: ILoginPayload): Promise<IAuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  async register(payload: IRegisterPayload): Promise<IAuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  // ─── Products ────────────────────────────────────────────────────────────────
  async getProducts(brandId?: string): Promise<IProduct[]> {
    let url = `${BASE_URL}/products?limit=40`;
    if (brandId) {
      url += `&brand=${brandId}`;
    }
    const res = await fetch(url);
    const data: ResponseType<IProduct> = await res.json();
    return data.data;
  }

  async getProductDetails(productID: string): Promise<IProduct> {
    const res = await fetch(`${BASE_URL}/products/${productID}`);
    const product = await res.json();
    return product.data;
  }

  // ─── Categories ──────────────────────────────────────────────────────────────
  async getCategories(): Promise<ICategory[]> {
    const res = await fetch(`${BASE_URL}/categories`);
    const data: ResponseType<ICategory> = await res.json();
    return data.data;
  }

  async getCategoryDetails(categoryId: string): Promise<ICategory> {
    const res = await fetch(`${BASE_URL}/categories/${categoryId}`);
    const data = await res.json();
    return data.data;
  }

  async getSubcategoriesOnCategory(categoryId: string): Promise<ISubCategory[]> {
    const res = await fetch(`${BASE_URL}/categories/${categoryId}/subcategories`);
    const data = await res.json();
    return data.data;
  }

  // ─── Brands ──────────────────────────────────────────────────────────────────
  async getBrands(): Promise<IBrand[]> {
    const res = await fetch(`${BASE_URL}/brands`);
    const data: ResponseType<IBrand> = await res.json();
    return data.data;
  }

  async getBrandDetails(brandId: string): Promise<IBrand> {
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
  async getWishlist(token?: string): Promise<IWishlistResponse> {
    const res = await fetch(`${BASE_URL}/wishlist`, {
      headers: getHeaders(token),
    });
    return res.json();
  }

  async addToWishlist(productId: string, token?: string): Promise<IWishlistResponse> {
    const res = await fetch(`${BASE_URL}/wishlist`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ productId }),
    });
    return res.json();
  }

  async removeFromWishlist(productId: string, token?: string): Promise<IWishlistResponse> {
    const res = await fetch(`${BASE_URL}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return res.json();
  }

  // ─── Orders ──────────────────────────────────────────────────────────────────
  async getUserOrders(userId: string, token?: string): Promise<IOrder[]> {
    const res = await fetch(`${BASE_URL}/orders/user/${userId}`, {
      headers: getHeaders(token),
    });
    return res.json();
  }

  async createCashOrder(cartId: string, payload: ICreateOrderPayload, token?: string): Promise<{ status: string; data: IOrder }> {
    const res = await fetch(`${BASE_URL}/orders/${cartId}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  async createOnlineOrder(cartId: string, payload: ICreateOrderPayload, token?: string): Promise<{ status: string; session: { url: string } }> {
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