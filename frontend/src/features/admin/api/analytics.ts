import { axios } from '@/lib/axios';

export interface AnalyticsStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  premiumUsers: number;
  userGrowth: {
    labels: string[];
    data: number[];
  };
}

export interface AnalyticsStatsResponse {
  success: boolean;
  data: AnalyticsStats;
}

export const getAnalyticsStats = (): Promise<AnalyticsStatsResponse> => {
  return axios.get('/admin/dashboard/analytics');
};

