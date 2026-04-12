import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  getCommunityPosts,
  getCommunityPost,
  getScheduledCount,
  createCommunityPost,
  updateCommunityPost,
  publishCommunityPost,
  deleteCommunityPost,
  changeCommunityPostStatus,
  getDeletedCommunityPosts,
  restoreCommunityPost,
  permanentDeleteCommunityPost,
  GetCommunityPostsParams,
  CommunityPostsResponse,
  CommunityPostResponse,
  CommunityPost,
  ScheduledCountResponse,
} from '../api/community';

// Re-export types for components
export type { CommunityPost, MediaItem } from '../api/community';

// Query Keys
export const communityKeys = {
  all: ['community'] as const,
  lists: () => [...communityKeys.all, 'list'] as const,
  list: (params: GetCommunityPostsParams) => [...communityKeys.lists(), params] as const,
  details: () => [...communityKeys.all, 'detail'] as const,
  detail: (id: string) => [...communityKeys.details(), id] as const,
  scheduledCount: () => [...communityKeys.all, 'scheduledCount'] as const,
  deleted: () => [...communityKeys.all, 'deleted'] as const,
  deletedList: (params: { page?: number; limit?: number }) => [...communityKeys.deleted(), params] as const,
};

// Hook: Get Community Posts List
export const useCommunityPosts = (params: GetCommunityPostsParams = {}) => {
  return useQuery<CommunityPostsResponse, Error>({
    queryKey: communityKeys.list(params),
    queryFn: () => getCommunityPosts(params),
    keepPreviousData: true,
  });
};

// Hook: Get Single Community Post
export const useCommunityPost = (postId: string) => {
  return useQuery<CommunityPostResponse, Error>({
    queryKey: communityKeys.detail(postId),
    queryFn: () => getCommunityPost(postId),
    enabled: !!postId,
  });
};

// Hook: Get Scheduled Posts Count
export const useScheduledCount = () => {
  return useQuery<ScheduledCountResponse, Error>({
    queryKey: communityKeys.scheduledCount(),
    queryFn: () => getScheduledCount(),
  });
};

// Hook: Create Community Post
export const useCreateCommunityPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createCommunityPost(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: communityKeys.scheduledCount() });
      toast.success(response.message || 'Post created successfully');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

// Hook: Update Community Post
export const useUpdateCommunityPost = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => updateCommunityPost(postId, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: communityKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: communityKeys.scheduledCount() });
      toast.success(response.message || 'Post updated successfully');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

// Hook: Publish Community Post
export const usePublishCommunityPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => publishCommunityPost(postId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: communityKeys.scheduledCount() });
      toast.success(response.message || 'Post published successfully');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

// Hook: Delete Community Post (Soft Delete)
export const useDeleteCommunityPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deleteCommunityPost(postId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: communityKeys.deleted() });
      queryClient.invalidateQueries({ queryKey: communityKeys.scheduledCount() });
      toast.success(response.message || 'Post deleted successfully');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

// Hook: Change Community Post Status
export const useChangeCommunityPostStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      status,
      scheduled_date,
    }: {
      postId: string;
      status: 'draft' | 'scheduled' | 'published';
      scheduled_date?: string | null;
    }) => changeCommunityPostStatus(postId, status, scheduled_date),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: communityKeys.scheduledCount() });
      toast.success(response.message || 'Post status updated successfully');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

// Hook: Get Deleted Community Posts
export const useDeletedCommunityPosts = (params: { page?: number; limit?: number } = {}) => {
  return useQuery<CommunityPostsResponse, Error>({
    queryKey: communityKeys.deletedList(params),
    queryFn: () => getDeletedCommunityPosts(params),
    keepPreviousData: true,
  });
};

// Hook: Restore Community Post
export const useRestoreCommunityPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => restoreCommunityPost(postId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: communityKeys.deleted() });
      queryClient.invalidateQueries({ queryKey: communityKeys.scheduledCount() });
      toast.success(response.message || 'Post restored successfully');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

// Hook: Permanent Delete Community Post
export const usePermanentDeleteCommunityPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => permanentDeleteCommunityPost(postId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.deleted() });
      toast.success(response.message || 'Post permanently deleted');
    },
    onError: () => {
      // Error is handled by axios interceptor
    },
  });
};

