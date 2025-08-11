import { Product } from '../../products/models/Product';

export interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
}

export interface Cart {
  id?: number;
  userId?: number;
  date?: string;
  products: CartItem[];
}

export interface CartSummary {
  totalItems: number;
  totalAmount: number;
  items: CartItem[];
}