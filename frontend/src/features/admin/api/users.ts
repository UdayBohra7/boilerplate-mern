import { axios } from '@/lib/axios';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  booking: number;
  createdAt: string;
  subscription: string;
  status: string;
  image?: string;
  address?: string;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: User[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  phone?: string;
  password: string;
  subscription?: string;
  status?: string;
  booking?: number;
  address?: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  phone?: string;
  subscription?: string;
  status?: string;
  booking?: number;
  address?: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  search?: string;
  subscription?: string;
  status?: string;
  date?: string; // ISO date string format YYYY-MM-DD
}

// API Functions
export const getUsers = (params: GetUsersParams = {}): Promise<UsersResponse> => {
  const { page = 1, limit = 10, sortBy = 'createdAt:desc', search, subscription, status, date } = params;

  let queryString = `page=${page}&limit=${limit}&sortBy=${sortBy}`;

  if (search) {
    queryString += `&search=${encodeURIComponent(search)}`;
  }
  if (subscription) {
    queryString += `&subscription=${encodeURIComponent(subscription)}`;
  }
  if (status) {
    queryString += `&status=${encodeURIComponent(status)}`;
  }
  if (date) {
    queryString += `&date=${encodeURIComponent(date)}`;
  }

  return axios.get(`/admin/user/getAllUsers?${queryString}`);
};

export const getUser = (userId: string): Promise<UserResponse> => {
  return axios.get(`/admin/user/getUserDetails/${userId}`);
};

export const createUser = (data: FormData): Promise<UserResponse> => {
  return axios.post('/admin/user/createUser', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateUser = (userId: string, data: FormData): Promise<UserResponse> => {
  return axios.put(`/admin/user/updateUser/${userId}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteUser = (userId: string): Promise<{ success: boolean; message: string }> => {
  return axios.delete(`/admin/user/deleteUser/${userId}`);
};

