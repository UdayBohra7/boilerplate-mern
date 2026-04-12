import { axios } from "@/lib/axios";
import { DurationFilter } from "./dashboardUserGraph";

export type DashboardEngagementGraph = {
    data: number[],
    labels: string[];
}

export interface DashboardEngagementGraphResponse {
    success: boolean;
    data: DashboardEngagementGraph;
}

export const getDashboardEngagementGraphData = (duration: DurationFilter): Promise<DashboardEngagementGraphResponse> => {
    return axios.get(`/admin/dashboard/engagement-graph?duration=${duration}`);
};

