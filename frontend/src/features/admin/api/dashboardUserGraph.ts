import { axios } from "@/lib/axios";

export type DashboardUserGraph = {
    labels: string[];
    data: number[];
}

export interface DashboardUserGraphResponse {
    success: boolean;
    data: DashboardUserGraph;
}

export type DurationFilter = "7d" | "1m" | "1y"

export const getDashboardUserGraphData = (duration: DurationFilter): Promise<DashboardUserGraphResponse> => {
    return axios.get(`/admin/dashboard/user-graph?duration=${duration}`);
};

