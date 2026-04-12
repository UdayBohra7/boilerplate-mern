import { axios } from "@/lib/axios";

export interface DailyEngagementData {
    date: string;
    community: number;
    meal_tracking: number;
    meal_plan: number;
    shopping: number;
    [key: string]: string | number;
}

export interface DailyEngagementResponse {
    success: boolean;
    data: DailyEngagementData[];
}

export const getDailyEngagementAnalytics = (startDate?: string, endDate?: string): Promise<DailyEngagementResponse> => {
    let query = '';
    if (startDate) query += `startDate=${startDate}&`;
    if (endDate) query += `endDate=${endDate}`;
    return axios.get(`/admin/dashboard/daily-engagement-analytics?${query}`);
};
