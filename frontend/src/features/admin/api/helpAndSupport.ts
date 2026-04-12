import { axios } from '@/lib/axios';

export interface HelpAndSupport {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    isResolved: boolean;
    resolvedAt?: string;
    resolvedBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetHelpAndSupportFilters {
    page?: number;
    limit?: number;
    search?: string;
    isResolved?: boolean | string;
    sortBy?: string;
}

export interface HelpAndSupportListResponse {
    results: HelpAndSupport[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
}

export const getHelpAndSupports = (
    params: GetHelpAndSupportFilters = {}
): Promise<HelpAndSupportListResponse> => {
    return axios.get('/admin/help-support', { params });
};

export const getHelpAndSupport = (id: string): Promise<HelpAndSupport> => {
    return axios.get(`/admin/help-support/${id}`);
};

export const resolveHelpAndSupport = (id: string): Promise<HelpAndSupport> => {
    return axios.patch(`/admin/help-support/${id}`, { isResolved: true });
};

export const deleteHelpAndSupport = (id: string): Promise<void> => {
    return axios.delete(`/admin/help-support/${id}`);
};
