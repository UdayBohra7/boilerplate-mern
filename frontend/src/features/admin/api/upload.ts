import { axios } from '@/lib/axios';

export interface UploadResponse {
    data: string; // The URL
    code: number;
    message: string;
}

export const uploadFile = (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post('/users/upload-file', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
