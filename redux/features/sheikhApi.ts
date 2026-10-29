import type { ApiResponse } from "@/lib/api-types";
import { baseApi } from "./baseApi";
export interface SheikhContent {
  _id: string;
  title: string;
  speakerName: string;
  type: "video" | "audio_travel";
  url: string;
  youtubeId?: string;
  isActive: boolean;
  createdAt?: string;
}

export const sheikhApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSheikhContents: builder.query<
      ApiResponse<SheikhContent[]>,
      Record<string, never>
    >({
      query: () => ({
        url: "/sheikh-content/all",
      }),
      providesTags: ["Sheikh"],
    }),
    createSheikhContent: builder.mutation({
      query: (data) => ({
        url: "/sheikh-content",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Sheikh"],
    }),
    updateSheikhContent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/sheikh-content/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Sheikh"],
    }),
    deleteSheikhContent: builder.mutation({
      query: (id) => ({
        url: `/sheikh-content/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sheikh"],
    }),
  }),
});

export const {
  useGetSheikhContentsQuery,
  useCreateSheikhContentMutation,
  useUpdateSheikhContentMutation,
  useDeleteSheikhContentMutation,
} = sheikhApi;
