import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { Header } from '@/shared/components/Layout/Header';
import { ProductGrid } from '@/domains/products/components/ProductGrid';
import { useFilteredProducts, useCategories } from '@/domains/products/hooks/useProducts';
import { ProductFilter } from '@/domains/products/models/Product';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  
  const {
    products,
    isLoading,
    filter,
    setFilter,
    sortBy,
    setSortBy
  } = useFilteredProducts();
  
  const { categories } = useCategories();

  // Initialize filters from URL params
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    
    if (urlCategory || urlSearch) {
      setFilter({
        category: urlCategory || undefined,
        searchTerm: urlSearch || undefined
      });
      setLocalSearchTerm(urlSearch || '');
    }
  }, [searchParams, setFilter]);

  const handleFilterChange = (newFilter: Partial<ProductFilter>) => {
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter);
    
    // Update URL params
    const params = new URLSearchParams();
    if (updatedFilter.category) params.set('category', updatedFilter.category);
    if (updatedFilter.searchTerm) params.set('search', updatedFilter.searchTerm);
    setSearchParams(params);
  };

  const handleSearch = (term: string) => {
    setLocalSearchTerm(term);
    handleFilterChange({ searchTerm: term });
  };

  const clearFilters = () => {
    setFilter({});
    setLocalSearchTerm('');
    setSearchParams({});
  };

  const activeFilterCount = [
    filter.category,
    filter.searchTerm,
    filter.minPrice,
    filter.maxPrice
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Products</h1>
          <p className="text-muted-foreground">
            Discover our complete collection of amazing products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Card className="card-modern">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <div className="flex items-center space-x-2">
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary">{activeFilterCount}</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden"
                    >
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={localSearchTerm}
                        onChange={(e) => setLocalSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch(localSearchTerm)}
                        className="input-modern pl-10"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select
                      value={filter.category || ''}
                      onValueChange={(value) => 
                        handleFilterChange({ category: value || undefined })
                      }
                    >
                      <SelectTrigger className="input-modern">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filter.minPrice || ''}
                        onChange={(e) => 
                          handleFilterChange({ 
                            minPrice: e.target.value ? Number(e.target.value) : undefined 
                          })
                        }
                        className="input-modern"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filter.maxPrice || ''}
                        onChange={(e) => 
                          handleFilterChange({ 
                            maxPrice: e.target.value ? Number(e.target.value) : undefined 
                          })
                        }
                        className="input-modern"
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {activeFilterCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Sort and Results */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {products.length} product{products.length !== 1 ? 's' : ''} found
              </p>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 input-modern">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                  <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filter.category && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>Category: {filter.category}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-2"
                      onClick={() => handleFilterChange({ category: undefined })}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
                {filter.searchTerm && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>Search: {filter.searchTerm}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-2"
                      onClick={() => {
                        setLocalSearchTerm('');
                        handleFilterChange({ searchTerm: undefined });
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}

            {/* Product Grid */}
            <ProductGrid products={products} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};