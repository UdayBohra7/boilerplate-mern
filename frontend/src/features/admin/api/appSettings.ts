import { axios } from '@/lib/axios';

export interface AppSettings {
    marissaKitchenBanner?: string;
    homePageProductBanner?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AppSettingsResponse {
    success: boolean;
    message: string;
    data: AppSettings;
}

export const getAppSettings = (): Promise<AppSettingsResponse> => {
    return axios.get('/admin/app-settings');
};

export const updateAppSettings = (data: FormData): Promise<AppSettingsResponse> => {
    return axios.put('/admin/app-settings', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
