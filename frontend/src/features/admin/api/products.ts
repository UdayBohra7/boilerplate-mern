import { axios } from '@/lib/axios';

// Types
export interface Product {
  _id: string;
  product_name: string;
  product_detail: string;
  category: {
    _id: string;
    name: string;
  } | string;
  images: string[];
  price: number;
  discount: number;
  quantity: number;
  status: 'Active' | 'Inactive';
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  discountedPrice?: number;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface CreateProductDTO {
  product_name: string;
  product_detail: string;
  category: string;
  price: number;
  discount?: number;
  quantity: number;
  status?: 'Active' | 'Inactive';
  images?: File[];
}

export interface UpdateProductDTO {
  product_name?: string;
  product_detail?: string;
  category?: string;
  price?: number;
  discount?: number;
  quantity?: number;
  status?: 'Active' | 'Inactive';
  images?: File[];
  existingImages?: string[];
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  search?: string;
  status?: string;
}

// API Functions
export const getProducts = (params: GetProductsParams = {}): Promise<ProductsResponse> => {
  const { page = 1, limit = 10, sortBy = 'createdAt:desc', search, status } = params;

  let queryString = `page=${page}&limit=${limit}&sortBy=${sortBy}`;

  if (search) {
    queryString += `&search=${encodeURIComponent(search)}`;
  }
  if (status) {
    queryString += `&status=${encodeURIComponent(status)}`;
  }

  return axios.get(`/admin/product?${queryString}`);
};

export const getProduct = (productId: string): Promise<ProductResponse> => {
  return axios.get(`/admin/product/${productId}`);
};

export const createProduct = (data: FormData): Promise<ProductResponse> => {
  return axios.post('/admin/product', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateProduct = (productId: string, data: FormData): Promise<ProductResponse> => {
  return axios.put(`/admin/product/edit/${productId}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProduct = (productId: string): Promise<{ success: boolean; message: string }> => {
  return axios.delete(`/admin/product?id=${productId}`);
};

export const changeProductStatus = (
  productId: string,
  status: 'Active' | 'Inactive'
): Promise<ProductResponse> => {
  return axios.post('/admin/product/status', { id: productId, status });
};

export const getDeletedProducts = (params: { page?: number; limit?: number } = {}): Promise<ProductsResponse> => {
  const { page = 1, limit = 10 } = params;
  return axios.get(`/admin/product/deleted?page=${page}&limit=${limit}`);
};

export const restoreProduct = (productId: string): Promise<{ success: boolean; message: string }> => {
  return axios.post(`/admin/product/restore/${productId}`);
};

export const permanentDeleteProduct = (productId: string): Promise<{ success: boolean; message: string }> => {
  return axios.delete(`/admin/product/permanent-delete?id=${productId}`);
};

