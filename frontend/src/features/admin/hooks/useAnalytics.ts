import { useQuery } from '@tanstack/react-query';
import { getAnalyticsStats, AnalyticsStatsResponse } from '../api/analytics';

export const analyticsKeys = {
  all: ['analytics'] as const,
  stats: () => [...analyticsKeys.all, 'stats'] as const,
};

export const useAnalyticsStats = () => {
  return useQuery<AnalyticsStatsResponse, Error>({
    queryKey: analyticsKeys.stats(),
    queryFn: getAnalyticsStats,
  });
};

