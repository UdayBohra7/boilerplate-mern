import { axios } from '@/lib/axios';

// Types
export interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

export interface CommunityPost {
  _id: string;
  title?: string;
  post_desc: string;
  media: MediaItem[];
  status: 'draft' | 'scheduled' | 'published';
  tags: string[];
  scheduled_date: string | null;
  published_at: string | null;
  created_by: {
    _id: string;
    name: string;
    email: string;
  };
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPostsResponse {
  success: boolean;
  message: string;
  data: CommunityPost[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface CommunityPostResponse {
  success: boolean;
  message: string;
  data: CommunityPost;
}

export interface ScheduledCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}

export interface CreateCommunityPostDTO {
  title?: string;
  post_desc: string;
  status?: 'draft' | 'scheduled' | 'published';
  scheduled_date?: string | null;
  tags?: string[];
  media?: File[];
}

export interface UpdateCommunityPostDTO {
  title?: string;
  post_desc?: string;
  status?: 'draft' | 'scheduled' | 'published';
  scheduled_date?: string | null;
  tags?: string[];
  media?: File[];
  existingMedia?: MediaItem[];
}

export interface GetCommunityPostsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  search?: string;
  status?: 'draft' | 'scheduled' | 'published';
}

// API Functions
export const getCommunityPosts = (params: GetCommunityPostsParams = {}): Promise<CommunityPostsResponse> => {
  const { page = 1, limit = 10, sortBy = 'createdAt:desc', search, status } = params;

  let queryString = `page=${page}&limit=${limit}&sortBy=${sortBy}`;

  if (search) {
    queryString += `&search=${encodeURIComponent(search)}`;
  }
  if (status) {
    queryString += `&status=${encodeURIComponent(status)}`;
  }

  return axios.get(`/admin/community?${queryString}`);
};

export const getCommunityPost = (postId: string): Promise<CommunityPostResponse> => {
  return axios.get(`/admin/community/${postId}`);
};

export const getScheduledCount = (): Promise<ScheduledCountResponse> => {
  return axios.get('/admin/community/scheduled-count');
};

export const createCommunityPost = (data: FormData): Promise<CommunityPostResponse> => {
  return axios.post('/admin/community', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateCommunityPost = (postId: string, data: FormData): Promise<CommunityPostResponse> => {
  return axios.put(`/admin/community/edit/${postId}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const publishCommunityPost = (postId: string): Promise<CommunityPostResponse> => {
  return axios.post(`/admin/community/publish/${postId}`);
};

export const deleteCommunityPost = (postId: string): Promise<{ success: boolean; message: string }> => {
  return axios.delete(`/admin/community?id=${postId}`);
};

export const changeCommunityPostStatus = (
  postId: string,
  status: 'draft' | 'scheduled' | 'published',
  scheduled_date?: string | null
): Promise<CommunityPostResponse> => {
  return axios.post('/admin/community/status', { id: postId, status, scheduled_date });
};

export const getDeletedCommunityPosts = (params: { page?: number; limit?: number } = {}): Promise<CommunityPostsResponse> => {
  const { page = 1, limit = 10 } = params;
  return axios.get(`/admin/community/deleted?page=${page}&limit=${limit}`);
};

export const restoreCommunityPost = (postId: string): Promise<{ success: boolean; message: string }> => {
  return axios.post(`/admin/community/restore/${postId}`);
};

export const permanentDeleteCommunityPost = (postId: string): Promise<{ success: boolean; message: string }> => {
  return axios.delete(`/admin/community/permanent-delete?id=${postId}`);
};

