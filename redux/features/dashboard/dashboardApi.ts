import type {
  Analytics,
  ApiResponse,
  NotificationManagement,
  ReportRange,
  Reports,
} from "@/lib/api-types";
import { baseApi } from "../baseApi";
interface UserManagement {
  totalUsers: number;
  activeUsers: number;
  restrictedUsers: number;
  bannedUsers: number;
}
const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<ApiResponse<Analytics>, void>({
      query: () => "/dashboard/analytics",
      providesTags: ["Dashboard"],
    }),
    getUserManagement: builder.query<ApiResponse<UserManagement>, void>({
      query: () => "/dashboard/user-management",
      providesTags: ["Dashboard", "User"],
    }),
    getReports: builder.query<ApiResponse<Reports>, ReportRange>({
      query: (range) => ({ url: "/dashboard/reports", params: { range } }),
      providesTags: ["Dashboard"],
    }),
    getNotificationManagement: builder.query<
      ApiResponse<NotificationManagement>,
      void
    >({
      query: () => "/dashboard/notification-management",
      providesTags: ["Dashboard"],
    }),
  }),
});
export const {
  useGetAnalyticsQuery,
  useGetUserManagementQuery,
  useGetReportsQuery,
  useGetNotificationManagementQuery,
} = dashboardApi;
