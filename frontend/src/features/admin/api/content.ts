import { axios } from '@/lib/axios';

export interface Content {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetContentFilters {
    page?: number;
    limit?: number;
    search?: string;
}

export interface ContentListResponse {
    data: Content[];
    pagination: {
        totalResults: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
    success: boolean;
    message: string;
}

export const getContents = (
    params: GetContentFilters = {}
): Promise<ContentListResponse> => {
    return axios.get('/admin/content', { params });
};

export const getContent = async (id: string): Promise<Content> => {
    const response = await axios.get<{ data: Content }>(`/admin/content/${id}`);
    return (response as any).data;
};

export const createContent = (data: { title: string; description: string }): Promise<Content> => {
    return axios.post('/admin/content', data);
};

export const editContent = (id: string, data: { title: string; description: string }): Promise<Content> => {
    return axios.post(`/admin/content/edit/${id}`, data);
};

export const deleteContent = (id: string): Promise<void> => {
    return axios.delete(`/admin/content?id=${id}`);
};
