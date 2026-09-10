import { baseApi } from "../baseApi";

export interface IDua {
  _id: string;
  externalId?: string;
  title: string;
  arabic: string;
  translation: string;
  transliteration?: string;
  category: string;
  audio?: string;
  repeat?: number;
  reference?: string;
  lang: string;
  version: number;
}

export const duaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDuas: builder.query<
      { success: boolean; data: IDua[]; meta: { total: number; page: number; limit: number; totalPages: number } },
      { lang?: string; category?: string; page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/dua",
        params,
      }),
      providesTags: ["Dua"],
    }),
    getDuaCategories: builder.query<{ success: boolean; data: string[] }, { lang?: string } | void>({
      query: (params) => ({
        url: "/dua/categories",
        params: params || {},
      }),
      providesTags: ["Dua"],
    }),
    createDua: builder.mutation<{ success: boolean; data: IDua; message: string }, Partial<IDua>>({
      query: (body) => ({
        url: "/dua",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Dua"],
    }),
    updateDua: builder.mutation<
      { success: boolean; data: IDua; message: string },
      { id: string; data: Partial<IDua> }
    >({
      query: ({ id, data }) => ({
        url: `/dua/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Dua"],
    }),
    deleteDua: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/dua/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Dua"],
    }),
    syncEnglishDuas: builder.mutation<{ success: boolean; data: { createdCount: number; updatedCount: number }; message: string }, void>({
      query: () => ({
        url: "/dua/sync",
        method: "POST",
      }),
      invalidatesTags: ["Dua"],
    }),
  }),
});

export const {
  useGetDuasQuery,
  useGetDuaCategoriesQuery,
  useCreateDuaMutation,
  useUpdateDuaMutation,
  useDeleteDuaMutation,
  useSyncEnglishDuasMutation,
} = duaApi;
