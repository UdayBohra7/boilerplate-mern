import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  ProfileResponse,
  ChangePasswordDTO,
  ChangePasswordResponse,
} from '../api/profile';

// Re-export types
export type { AdminProfile, UpdateProfileDTO, ChangePasswordDTO } from '../api/profile';

// Query Keys
export const profileKeys = {
  all: ['admin-profile'] as const,
  profile: () => [...profileKeys.all, 'profile'] as const,
};

// Hook: Get Admin Profile
export const useAdminProfile = () => {
  return useQuery<ProfileResponse, Error>({
    queryKey: profileKeys.profile(),
    queryFn: () => getAdminProfile(),
  });
};

// Hook: Update Admin Profile
export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => updateAdminProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      // Also invalidate the auth user query to update the user state
      queryClient.invalidateQueries({ queryKey: ['authenticated-user'] });
      toast.success(response.message || 'Profile updated successfully');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

// Hook: Change Admin Password
export const useChangeAdminPassword = () => {
  return useMutation<ChangePasswordResponse, Error, ChangePasswordDTO>({
    mutationFn: (data: ChangePasswordDTO) => changeAdminPassword(data),
    onSuccess: (response) => {
      toast.success(response.message || 'Password changed successfully');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

