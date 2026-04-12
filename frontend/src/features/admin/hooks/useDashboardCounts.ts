import { useQuery } from '@tanstack/react-query';
import { DashboardCountResponse, getDashboardCounts } from '../api/dashboardCounts';

export const countKeys = {
  all: ['counts'] as const,
  stats: () => [...countKeys.all, 'stats'] as const,
};

export const useCounts = () => {
  return useQuery<DashboardCountResponse, Error>({
    queryKey: countKeys.stats(),
    queryFn: getDashboardCounts,
  });
};

