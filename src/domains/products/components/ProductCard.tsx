import { Product } from '../models/Product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/domains/carts/hooks/useCart';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const capitalizeCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="product-card h-full">
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-t-xl bg-surface/50">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>
          
          {/* Product Info */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <Badge variant="secondary" className="text-xs">
                {capitalizeCategory(product.category)}
              </Badge>
              {product.rating && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3 fill-current text-yellow-500" />
                  <span>{product.rating.rate}</span>
                  <span>({product.rating.count})</span>
                </div>
              )}
            </div>
            
            <h3 className="font-semibold text-sm line-clamp-2 mb-2 text-foreground">
              {product.title}
            </h3>
            
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {product.description}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 px-4 pb-4">
          <div className="flex items-center justify-between w-full">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="btn-gradient"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};