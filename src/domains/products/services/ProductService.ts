import { Product, ProductFilter } from '../models/Product';

class ProductService {
  private readonly baseUrl = 'https://fakestoreapi.com';

  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: number): Promise<Product> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products/category/${category}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products by category: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products/categories`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  filterProducts(products: Product[], filter: ProductFilter): Product[] {
    return products.filter(product => {
      if (filter.category && product.category !== filter.category) {
        return false;
      }
      if (filter.minPrice && product.price < filter.minPrice) {
        return false;
      }
      if (filter.maxPrice && product.price > filter.maxPrice) {
        return false;
      }
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        return (
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }

  sortProducts(products: Product[], sortBy: string): Product[] {
    const [field, direction] = sortBy.split('-');
    
    return [...products].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (field) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'rating':
          aValue = a.rating?.rate || 0;
          bValue = b.rating?.rate || 0;
          break;
        default:
          return 0;
      }

      if (direction === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    });
  }
}

export const productService = new ProductService();