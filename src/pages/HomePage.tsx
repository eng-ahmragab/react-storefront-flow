import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ShoppingBag, Star, TrendingUp } from 'lucide-react';
import { Header } from '@/shared/components/Layout/Header';
import { ProductGrid } from '@/domains/products/components/ProductGrid';
import { useProducts, useCategories } from '@/domains/products/hooks/useProducts';

export const HomePage = () => {
  const { products, isLoading } = useProducts();
  const { categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');

  // Featured products (first 4)
  const featuredProducts = products.slice(0, 4);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Navigate to products page with search
    window.location.href = `/products?search=${encodeURIComponent(term)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Discover Amazing Products
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Shop the latest trends with our curated collection of high-quality products at unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="btn-gradient">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Shop Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <TrendingUp className="w-5 h-5 mr-2" />
                View Trending
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our wide range of categories to find exactly what you're looking for.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link key={category} to={`/products?category=${encodeURIComponent(category)}`}>
                <Card className="card-modern p-6 text-center">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold capitalize">{category}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-surface/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
              <p className="text-muted-foreground">
                Handpicked products just for you
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <ProductGrid products={featuredProducts} isLoading={isLoading} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-modern text-center p-8">
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                <p className="text-muted-foreground">Products Available</p>
              </CardContent>
            </Card>
            
            <Card className="card-modern text-center p-8">
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-accent mb-2">50k+</div>
                <p className="text-muted-foreground">Happy Customers</p>
              </CardContent>
            </Card>
            
            <Card className="card-modern text-center p-8">
              <CardContent className="p-0 flex items-center justify-center flex-col">
                <div className="flex items-center text-4xl font-bold text-success mb-2">
                  4.8
                  <Star className="w-8 h-8 ml-2 fill-current" />
                </div>
                <p className="text-muted-foreground">Customer Rating</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};