import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { getAppSettings, updateAppSettings } from '../api/appSettings';

export const appSettingsKeys = {
    all: ['appSettings'] as const,
    details: () => [...appSettingsKeys.all, 'detail'] as const,
};

export const useGetAppSettings = () => {
    return useQuery({
        queryKey: appSettingsKeys.details(),
        queryFn: () => getAppSettings(),
    });
};

export const useUpdateAppSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAppSettings,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: appSettingsKeys.all });
            toast.success(data.message || 'App Settings updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update app settings');
        },
    });
};
