import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
    getContents,
    getContent,
    createContent,
    editContent,
    deleteContent,
    GetContentFilters,
    ContentListResponse,
    Content,
} from '../api/content';

export const contentKeys = {
    all: ['content'] as const,
    lists: () => [...contentKeys.all, 'list'] as const,
    list: (filters: GetContentFilters) => [...contentKeys.lists(), filters] as const,
    details: () => [...contentKeys.all, 'detail'] as const,
    detail: (id: string) => [...contentKeys.details(), id] as const,
};

export const useContents = (filters: GetContentFilters = {}) => {
    return useQuery<ContentListResponse, Error>({
        queryKey: contentKeys.list(filters),
        queryFn: () => getContents(filters),
        keepPreviousData: true,
    });
};

export const useContent = (id: string) => {
    return useQuery<Content, Error>({
        queryKey: contentKeys.detail(id),
        queryFn: () => getContent(id),
        enabled: !!id,
    });
};

export const useCreateContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { title: string; description: string }) => createContent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
            toast.success('Content created successfully');
        },
        onError: () => {
            toast.error('Failed to create content');
        },
    });
};

export const useEditContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { title: string; description: string } }) =>
            editContent(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: contentKeys.detail(variables.id) });
            toast.success('Content updated successfully');
        },
        onError: () => {
            toast.error('Failed to update content');
        },
    });
};

export const useDeleteContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteContent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: contentKeys.lists() });
            toast.success('Content deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete content');
        },
    });
};

export type { Content };
