import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    GetCategoriesParams,
    CategoriesResponse,
    CategoryResponse,
} from '../api/categories';

export type { Category } from '../api/categories';

export const categoryKeys = {
    all: ['categories'] as const,
    lists: () => [...categoryKeys.all, 'list'] as const,
    list: (params: GetCategoriesParams) => [...categoryKeys.lists(), params] as const,
    details: () => [...categoryKeys.all, 'detail'] as const,
    detail: (id: string) => [...categoryKeys.details(), id] as const,
};

export const useCategories = (params: GetCategoriesParams = {}) => {
    return useQuery<CategoriesResponse, Error>({
        queryKey: categoryKeys.list(params),
        queryFn: () => getCategories(params),
        keepPreviousData: true,
    });
};

export const useCategory = (id: string) => {
    return useQuery<CategoryResponse, Error>({
        queryKey: categoryKeys.detail(id),
        queryFn: () => getCategory(id),
        enabled: !!id,
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormData) => createCategory(data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
            toast.success(response.message || 'Category created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create category');
        },
    });
};

export const useUpdateCategory = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormData) => updateCategory(id, data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
            toast.success(response.message || 'Category updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update category');
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteCategory(id),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
            toast.success(response.message || 'Category deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        },
    });
};
