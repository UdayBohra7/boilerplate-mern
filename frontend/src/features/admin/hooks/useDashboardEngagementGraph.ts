import { useQuery } from '@tanstack/react-query';
import { DurationFilter } from '../api/dashboardUserGraph';
import { DashboardEngagementGraphResponse, getDashboardEngagementGraphData } from '../api/dashboardEngagementGraph';

export const graphKeys = {
  all: ['engagement-graph'] as const,
  stats: (duration: DurationFilter) => [...graphKeys.all, 'stats', duration] as const,
};

export const useEngagementGraph = (duration: DurationFilter) => {
  return useQuery<DashboardEngagementGraphResponse, Error>({
    queryKey: graphKeys.stats(duration),
    queryFn: () => getDashboardEngagementGraphData(duration),
  });
};

