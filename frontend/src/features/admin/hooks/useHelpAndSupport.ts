import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
    getHelpAndSupports,
    resolveHelpAndSupport,
    deleteHelpAndSupport,
    GetHelpAndSupportFilters,
    HelpAndSupportListResponse,
} from '../api/helpAndSupport';

export const helpAndSupportKeys = {
    all: ['helpAndSupport'] as const,
    lists: () => [...helpAndSupportKeys.all, 'list'] as const,
    list: (filters: GetHelpAndSupportFilters) =>
        [...helpAndSupportKeys.lists(), filters] as const,
    details: () => [...helpAndSupportKeys.all, 'detail'] as const,
    detail: (id: string) => [...helpAndSupportKeys.details(), id] as const,
};

export const useHelpAndSupports = (filters: GetHelpAndSupportFilters = {}) => {
    return useQuery<HelpAndSupportListResponse, Error>({
        queryKey: helpAndSupportKeys.list(filters),
        queryFn: () => getHelpAndSupports(filters),
        keepPreviousData: true,
    });
};

export const useResolveHelpAndSupport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => resolveHelpAndSupport(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: helpAndSupportKeys.lists() });
            toast.success('Inquiry resolved successfully');
        },
        onError: (error: any) => {
            // toast.error(error.response?.data?.message || 'Failed to resolve inquiry');
        },
    });
};

export const useDeleteHelpAndSupport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteHelpAndSupport(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: helpAndSupportKeys.lists() });
            toast.success('Inquiry deleted successfully');
        },
        onError: (error: any) => {
            // toast.error(error.response?.data?.message || 'Failed to delete inquiry');
        },
    });
};

export type { HelpAndSupport } from '../api/helpAndSupport';
