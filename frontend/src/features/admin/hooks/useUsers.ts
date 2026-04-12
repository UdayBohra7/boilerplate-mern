import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  GetUsersParams,
  UsersResponse,
  UserResponse,
  User,
} from '../api/users';

// Re-export User type for components
export type { User } from '../api/users';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: GetUsersParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hook: Get Users List
export const useUsers = (params: GetUsersParams = {}) => {
  return useQuery<UsersResponse, Error>({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
    keepPreviousData: true,
  });
};

// Hook: Get Single User
export const useUser = (userId: string) => {
  return useQuery<UserResponse, Error>({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
};

// Hook: Create User
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createUser(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success(response.message || 'User created successfully');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

// Hook: Update User
export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => updateUser(userId, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      toast.success(response.message || 'User updated successfully');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

// Hook: Delete User
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success(response.message || 'User deleted successfully');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

