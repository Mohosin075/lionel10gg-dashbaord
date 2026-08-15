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
  }),
});

export const { useGetAnalyticsQuery, useGetUserManagementQuery } =
  dashboardApi;
