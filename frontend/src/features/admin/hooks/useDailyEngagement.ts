import { useQuery } from '@tanstack/react-query';
import { getDailyEngagementAnalytics, DailyEngagementResponse } from '../api/dailyEngagement';

export const useDailyEngagement = (startDate?: string, endDate?: string) => {
    return useQuery<DailyEngagementResponse, Error>(['dailyEngagement', startDate, endDate], () => getDailyEngagementAnalytics(startDate, endDate));
};
