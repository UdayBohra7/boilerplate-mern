import { axios } from '@/lib/axios';

export interface Category {
    _id: string;
    name: string;
    description: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}

export interface CategoriesResponse {
    status: number;
    message: string;
    data: Category[];
    pagination: {
        totalDocs: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}

export interface CategoryResponse {
    status: number;
    message: string;
    data: Category;
}

export interface CreateCategoryDTO {
    name: string;
    description: string;
}

export interface UpdateCategoryDTO {
    name?: string;
    description?: string;
}

export interface GetCategoriesParams {
    page?: number;
    limit?: number;
    search?: string;
}

// API Functions
export const getCategories = (params: GetCategoriesParams = {}): Promise<CategoriesResponse> => {
    const { page = 1, limit = 10, search } = params;

    let queryString = `page=${page}&limit=${limit}`;

    if (search) {
        queryString += `&search=${encodeURIComponent(search)}`;
    }

    return axios.get(`/admin/category?${queryString}`);
};

export const getCategory = (id: string): Promise<CategoryResponse> => {
    return axios.get(`/admin/category/${id}`);
};

export const createCategory = (data: FormData): Promise<CategoryResponse> => {
    return axios.post('/admin/category', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateCategory = (id: string, data: FormData): Promise<CategoryResponse> => {
    return axios.patch(`/admin/category/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteCategory = (id: string): Promise<CategoryResponse> => {
    return axios.post(`/admin/category/${id}`, {});
};
