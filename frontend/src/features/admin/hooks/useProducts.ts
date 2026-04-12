import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  changeProductStatus,
  getDeletedProducts,
  restoreProduct,
  permanentDeleteProduct,
  GetProductsParams,
  ProductsResponse,
  ProductResponse,
  Product,
} from '../api/products';

// Re-export Product type for components
export type { Product } from '../api/products';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: GetProductsParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  deleted: () => [...productKeys.all, 'deleted'] as const,
  deletedList: (params: { page?: number; limit?: number }) => [...productKeys.deleted(), params] as const,
};

// Hook: Get Products List
export const useProducts = (params: GetProductsParams = {}) => {
  return useQuery<ProductsResponse, Error>({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
    keepPreviousData: true,
  });
};

// Hook: Get Single Product
export const useProduct = (productId: string) => {
  return useQuery<ProductResponse, Error>({
    queryKey: productKeys.detail(productId),
    queryFn: () => getProduct(productId),
    enabled: !!productId,
  });
};

// Hook: Create Product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createProduct(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success(response.message || 'Product created successfully');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

// Hook: Update Product
export const useUpdateProduct = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => updateProduct(productId, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
      toast.success(response.message || 'Product updated successfully');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

// Hook: Delete Product (Soft Delete)
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.deleted() });
      toast.success(response.message || 'Product deleted successfully');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

// Hook: Change Product Status
export const useChangeProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, status }: { productId: string; status: 'Active' | 'Inactive' }) =>
      changeProductStatus(productId, status),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success(response.message || 'Product status updated successfully');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

// Hook: Get Deleted Products
export const useDeletedProducts = (params: { page?: number; limit?: number } = {}) => {
  return useQuery<ProductsResponse, Error>({
    queryKey: productKeys.deletedList(params),
    queryFn: () => getDeletedProducts(params),
    keepPreviousData: true,
  });
};

// Hook: Restore Product
export const useRestoreProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => restoreProduct(productId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.deleted() });
      toast.success(response.message || 'Product restored successfully');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

// Hook: Permanent Delete Product
export const usePermanentDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => permanentDeleteProduct(productId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.deleted() });
      toast.success(response.message || 'Product permanently deleted');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

