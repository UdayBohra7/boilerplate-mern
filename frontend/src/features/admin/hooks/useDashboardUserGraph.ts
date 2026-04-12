import { useQuery } from '@tanstack/react-query';
import { DashboardUserGraphResponse, DurationFilter, getDashboardUserGraphData } from '../api/dashboardUserGraph';

export const graphKeys = {
  all: ['user-graph'] as const,
  stats: (duration: DurationFilter) => [...graphKeys.all, 'stats', duration] as const,
};

export const useUserGraph = (duration: DurationFilter) => {
  return useQuery<DashboardUserGraphResponse, Error>({
    queryKey: graphKeys.stats(duration),
    queryFn: () => getDashboardUserGraphData(duration),
  });
};

