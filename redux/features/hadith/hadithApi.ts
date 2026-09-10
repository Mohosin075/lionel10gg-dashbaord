import { baseApi } from "../baseApi";

export interface IHadithCollection {
  key: string;
  edition: string;
  name: string;
  count: number;
  isAvailable: boolean;
}

export interface IHadith {
  _id: string;
  hadithNo: number;
  source: string;
  chapter: string;
  chapterNo?: number;
  arabicText: string;
  translation: string;
  authenticity?: string;
  category?: string;
  lang: string;
  isActive: boolean;
  version: number;
  createdAt: string;
}

export const hadithApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCollections: builder.query<{ success: boolean; data: IHadithCollection[] }, { lang?: string } | void>({
      query: (params) => ({
        url: "/hadith/collections",
        params: params || {},
      }),
      providesTags: ["Hadith"],
    }),
    getHadiths: builder.query<
      { success: boolean; data: IHadith[]; meta: { total: number; page: number; limit: number; totalPages: number } },
      { source?: string; lang?: string; category?: string; page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/hadith",
        params,
      }),
      providesTags: ["Hadith"],
    }),
    createHadith: builder.mutation<{ success: boolean; data: IHadith; message: string }, Partial<IHadith>>({
      query: (body) => ({
        url: "/hadith",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Hadith"],
    }),
    updateHadith: builder.mutation<
      { success: boolean; data: IHadith; message: string },
      { id: string; data: Partial<IHadith> }
    >({
      query: ({ id, data }) => ({
        url: `/hadith/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Hadith"],
    }),
    deleteHadith: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/hadith/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hadith"],
    }),
    syncExternalHadith: builder.mutation<
      { success: boolean; data: { createdCount: number; updatedCount: number }; message: string },
      { edition: string; from: number; to: number }
    >({
      query: (body) => ({
        url: "/hadith/sync-external",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Hadith"],
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useGetHadithsQuery,
  useCreateHadithMutation,
  useUpdateHadithMutation,
  useDeleteHadithMutation,
  useSyncExternalHadithMutation,
} = hadithApi;
