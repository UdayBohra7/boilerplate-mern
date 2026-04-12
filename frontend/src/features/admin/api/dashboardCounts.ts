import { axios } from "@/lib/axios";

export type DashboardCount = {
    totalUser: {
        totalCount: number;
        monthlyRate: string;
    },
    totalMealsLogged: {
        totalCount: number;
        monthlyRate: string;
    },
    totalMealPlans: {
        totalCount: number;
        monthlyRate: string;
    },
    engagementRate: {
        totalCount: number;
        monthlyRate: string;
    }
}

export interface DashboardCountResponse {
    success: boolean;
    data: DashboardCount;
}

export const getDashboardCounts = (): Promise<DashboardCountResponse> => {
    return axios.get('/admin/dashboard/counts');
};

