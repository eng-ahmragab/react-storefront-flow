import { Cart, CartItem, CartSummary } from '../models/Cart';
import { Product } from '../../products/models/Product';
import { productService } from '../../products/services/ProductService';

class CartService {
  private readonly baseUrl = 'https://fakestoreapi.com';
  private readonly CART_STORAGE_KEY = 'ecommerce_cart';

  // Local cart management (since API is for demo)
  getLocalCart(): CartItem[] {
    try {
      const stored = localStorage.getItem(this.CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  }

  saveLocalCart(items: CartItem[]): void {
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  addToCart(productId: number, quantity: number = 1): CartItem[] {
    const cart = this.getLocalCart();
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }

    this.saveLocalCart(cart);
    return cart;
  }

  removeFromCart(productId: number): CartItem[] {
    const cart = this.getLocalCart().filter(item => item.productId !== productId);
    this.saveLocalCart(cart);
    return cart;
  }

  updateCartItemQuantity(productId: number, quantity: number): CartItem[] {
    const cart = this.getLocalCart();
    const item = cart.find(item => item.productId === productId);
    
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      }
      item.quantity = quantity;
      this.saveLocalCart(cart);
    }
    
    return cart;
  }

  clearCart(): void {
    this.saveLocalCart([]);
  }

  async getCartWithProducts(): Promise<CartItem[]> {
    const cart = this.getLocalCart();
    const cartWithProducts = await Promise.all(
      cart.map(async (item) => {
        try {
          const product = await productService.getProductById(item.productId);
          return { ...item, product };
        } catch (error) {
          console.error(`Error fetching product ${item.productId}:`, error);
          return item;
        }
      })
    );
    return cartWithProducts;
  }

  async getCartSummary(): Promise<CartSummary> {
    const items = await this.getCartWithProducts();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    return {
      totalItems,
      totalAmount,
      items
    };
  }

  // API methods (for demonstration)
  async createCartOnAPI(cart: Cart): Promise<Cart> {
    try {
      const response = await fetch(`${this.baseUrl}/carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create cart: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  }

  async getUserCarts(userId: number): Promise<Cart[]> {
    try {
      const response = await fetch(`${this.baseUrl}/carts/user/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user carts: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user carts:', error);
      throw error;
    }
  }
}

export const cartService = new CartService();