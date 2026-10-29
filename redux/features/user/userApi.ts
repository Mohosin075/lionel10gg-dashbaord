import type { ApiResponse } from "@/lib/api-types";
import { baseApi } from "../baseApi";

export type AppUser = {
  _id: string;
  name?: string;
  email?: string;
  status?: string;
  role?: string;
  subscriptionStatus?: string;
  subscriptionTier?: string;
  createdAt?: string;
  updatedAt?: string;
  totalHasanat?: number;
};

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ApiResponse<AppUser>, void>({
      query: () => "/user/profile",
      providesTags: ["Profile"],
    }),

    getUsers: builder.query<
      ApiResponse<AppUser[]>,
      {
        page?: number;
        limit?: number;
        searchTerm?: string;
        status?: string;
      } | void
    >({
      query: (params) => ({
        url: "/user",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
          ...(params?.searchTerm ? { searchTerm: params.searchTerm } : {}),
          ...(params?.status ? { status: params.status } : {}),
        },
      }),
      providesTags: ["User"],
    }),

    updateUserStatus: builder.mutation({
      query: ({ userId, status }: { userId: string; status: string }) => ({
        url: `/user/${userId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["User", "Dashboard"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} = userApi;
