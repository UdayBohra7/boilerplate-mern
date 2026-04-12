import { axios } from '@/lib/axios';

// Types
export interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: string;
  createdAt: string;
  bio?: string;
  address?: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: AdminProfile;
}

export interface UpdateProfileDTO {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  address?: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// API Functions
export const getAdminProfile = (): Promise<ProfileResponse> => {
  return axios.get('/auth/me');
};

export const updateAdminProfile = (data: FormData): Promise<ProfileResponse> => {
  return axios.put('/auth/update-profile', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const changeAdminPassword = (data: ChangePasswordDTO): Promise<ChangePasswordResponse> => {
  return axios.put('/auth/change-password', data);
};

