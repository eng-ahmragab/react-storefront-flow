import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { productService } from '../services/ProductService';
import { Product, ProductFilter } from '../models/Product';

export const useProducts = () => {
  const {
    data: products = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAllProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    products,
    isLoading,
    error,
    refetch
  };
};

export const useProduct = (id: number) => {
  const {
    data: product,
    isLoading,
    error
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });

  return {
    product,
    isLoading,
    error
  };
};

export const useCategories = () => {
  const {
    data: categories = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    categories,
    isLoading,
    error
  };
};

export const useFilteredProducts = () => {
  const { products, isLoading, error } = useProducts();
  const [filter, setFilter] = useState<ProductFilter>({});
  const [sortBy, setSortBy] = useState<string>('title-asc');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = productService.filterProducts(products, filter);
    return productService.sortProducts(filtered, sortBy);
  }, [products, filter, sortBy]);

  return {
    products: filteredAndSortedProducts,
    isLoading,
    error,
    filter,
    setFilter,
    sortBy,
    setSortBy
  };
};