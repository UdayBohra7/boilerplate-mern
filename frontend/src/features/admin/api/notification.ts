import { axios } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type NotificationType = "email" | "push" | "system";

export interface CreateNotificationDTO {
    userIds: string[];
    title: string;
    message: string;
    channel: NotificationType;
}

export interface Notification {
    _id: string;
    title: string;
    message: string;
    channel: NotificationType;
    status: string;
    sentBy: {
        _id: string;
        email: string;
        name: string;
        image: string;
    }
    users: string[]; // Array of successful user IDs
    failedUsers: {
        userId: string;
        error: string;
    }[];
    readBy: string[]; // Array of user IDs who have read the notification
    marked?: boolean;
    logs?: {
        status: string;
        message: string;
        updatedAt: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface GetNotificationsParams {
    page?: number;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
    mine?: boolean;
    filter?: 'sent' | 'received';
}

export interface NotificationsResponse {
    success: boolean;
    message: string;
    data: Notification[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        pageSize: number;
    }
    unreadCount?: number;
}

export const getNotifications = (params: GetNotificationsParams): Promise<NotificationsResponse> => {
    return axios.get("/admin/notification", { params });
};

export const sendNotification = (data: CreateNotificationDTO) => {
    return axios.post("/admin/notification", data);
};

export const deleteNotification = (id: string) => {
    return axios.delete(`/admin/notification?id=${id}`);
};

export const markAsRead = (notificationIds: string[]) => {
    return axios.post("/admin/notification/selected", { notificationIds });
};

export const useNotifications = (params: GetNotificationsParams) => {
    return useQuery<NotificationsResponse, Error>(["notifications", params], () => getNotifications(params));
};

export const useSendNotification = () => {
    const queryClient = useQueryClient();
    return useMutation(sendNotification, {
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
            queryClient.invalidateQueries(["notification-stats"]);
        }
    });
};

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();
    return useMutation(deleteNotification, {
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
            queryClient.invalidateQueries(["notification-stats"]);
        }
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation(markAsRead, {
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
        }
    });
};

export interface NotificationStats {
    totalNotifications: number;
    totalSentByAdmin: number;
    successfulDeliveries: number;
    failedDeliveries: number;
}

const getNotificationStats = (): Promise<{ success: boolean; data: NotificationStats }> => {
    return axios.get("/admin/notification/stats");
};

export const useNotificationStats = () => {
    return useQuery({
        queryKey: ["notification-stats"],
        queryFn: () => getNotificationStats(),
    });
};
