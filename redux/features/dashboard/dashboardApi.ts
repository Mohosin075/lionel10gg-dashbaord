import { baseApi } from "../baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<any, void>({
      query: () => "/dashboard/analytics",
      providesTags: ["Dashboard"],
    }),

    getUserManagement: builder.query<any, void>({
      query: () => "/dashboard/user-management",
      providesTags: ["Dashboard", "User"],
    }),

    getReports: builder.query<any, void>({
      query: () => "/dashboard/reports",
      providesTags: ["Dashboard"],
    }),

    getNotificationManagement: builder.query<any, void>({
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
