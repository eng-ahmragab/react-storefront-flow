import { useState, useEffect } from 'react';
import { cartService } from '../services/CartService';
import { CartItem, CartSummary } from '../models/Cart';
import { useToast } from '@/hooks/use-toast';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    totalItems: 0,
    totalAmount: 0,
    items: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadCart = async () => {
    setIsLoading(true);
    try {
      const cartItems = await cartService.getCartWithProducts();
      const summary = await cartService.getCartSummary();
      setCart(cartItems);
      setCartSummary(summary);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load cart items"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      cartService.addToCart(productId, quantity);
      await loadCart();
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart"
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart"
      });
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      cartService.removeFromCart(productId);
      await loadCart();
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart"
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from cart"
      });
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      cartService.updateCartItemQuantity(productId, quantity);
      await loadCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update item quantity"
      });
    }
  };

  const clearCart = async () => {
    try {
      cartService.clearCart();
      await loadCart();
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart"
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear cart"
      });
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return {
    cart,
    cartSummary,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart: loadCart
  };
};