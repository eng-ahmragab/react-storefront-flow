import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Header } from '@/shared/components/Layout/Header';
import { useCart } from '@/domains/carts/hooks/useCart';

export const CartPage = () => {
  const { cartSummary, updateQuantity, removeFromCart, clearCart, isLoading } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (cartSummary.totalItems === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/products">
              <Button className="btn-gradient">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/products">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {cartSummary.totalItems} item{cartSummary.totalItems !== 1 ? 's' : ''} in your cart
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartSummary.items.map((item) => (
              <Card key={item.productId} className="card-modern">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-24 h-24 bg-surface rounded-lg overflow-hidden flex-shrink-0">
                      {item.product && (
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold line-clamp-2 mb-1">
                            {item.product?.title || 'Loading...'}
                          </h3>
                          {item.product && (
                            <Badge variant="secondary" className="text-xs mb-2">
                              {item.product.category}
                            </Badge>
                          )}
                          <p className="text-lg font-bold text-primary">
                            {item.product ? formatPrice(item.product.price) : '$0.00'}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.productId)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
                        <span className="text-sm text-muted-foreground">
                          {item.quantity} × {item.product ? formatPrice(item.product.price) : '$0.00'}
                        </span>
                        <span className="font-semibold">
                          {item.product ? formatPrice(item.product.price * item.quantity) : '$0.00'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear Cart */}
            {cartSummary.totalItems > 0 && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="card-modern sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartSummary.totalItems} items)</span>
                  <span>{formatPrice(cartSummary.totalAmount)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(cartSummary.totalAmount * 0.1)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(cartSummary.totalAmount * 1.1)}</span>
                </div>
                
                <Button className="w-full btn-gradient mt-6" size="lg">
                  Proceed to Checkout
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Secure checkout powered by demo API
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};