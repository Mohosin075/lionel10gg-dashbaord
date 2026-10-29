import type {
  ApiResponse,
  KnowledgeArticle,
  KnowledgeBook,
  KnowledgeFatwa,
} from "@/lib/api-types";
import { baseApi } from "./baseApi";
interface Filters {
  lang: string;
  page?: number;
  limit?: number;
  category?: string;
  searchTerm?: string;
  source?: string;
  strictLang?: boolean;
}
export const knowledgeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query<ApiResponse<KnowledgeArticle[]>, Filters>({
      query: (params) => ({ url: "/knowledge-library", params }),
      providesTags: ["Knowledge"],
    }),
    getArticle: builder.query<ApiResponse<KnowledgeArticle>, string>({
      query: (id) => "/knowledge-library/" + id,
      providesTags: ["Knowledge"],
    }),
    createArticle: builder.mutation<
      ApiResponse<KnowledgeArticle>,
      Partial<KnowledgeArticle>
    >({
      query: (body) => ({ url: "/knowledge-library", method: "POST", body }),
      invalidatesTags: ["Knowledge", "OfflinePack"],
    }),
    updateArticle: builder.mutation<
      ApiResponse<KnowledgeArticle>,
      { id: string } & Partial<KnowledgeArticle>
    >({
      query: ({ id, ...body }) => ({
        url: "/knowledge-library/" + id,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Knowledge", "OfflinePack"],
    }),
    deleteArticle: builder.mutation<ApiResponse<KnowledgeArticle>, string>({
      query: (id) => ({ url: "/knowledge-library/" + id, method: "DELETE" }),
      invalidatesTags: ["Knowledge", "OfflinePack"],
    }),
    getBooks: builder.query<ApiResponse<KnowledgeBook[]>, Filters>({
      query: (params) => ({ url: "/knowledge-library/books", params }),
      providesTags: ["Knowledge"],
    }),
    getBook: builder.query<ApiResponse<KnowledgeBook>, string>({
      query: (id) => "/knowledge-library/books/" + id,
      providesTags: ["Knowledge"],
    }),
    createBook: builder.mutation<
      ApiResponse<KnowledgeBook>,
      Partial<KnowledgeBook>
    >({
      query: (body) => ({
        url: "/knowledge-library/books",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Knowledge", "OfflinePack"],
    }),
    updateBook: builder.mutation<
      ApiResponse<KnowledgeBook>,
      { id: string } & Partial<KnowledgeBook>
    >({
      query: ({ id, ...body }) => ({
        url: "/knowledge-library/books/" + id,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Knowledge", "OfflinePack"],
    }),
    deleteBook: builder.mutation<ApiResponse<KnowledgeBook>, string>({
      query: (id) => ({
        url: "/knowledge-library/books/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Knowledge", "OfflinePack"],
    }),
    getFatwas: builder.query<ApiResponse<KnowledgeFatwa[]>, Filters>({
      query: (params) => ({ url: "/knowledge-library/fatwas", params }),
      providesTags: ["Knowledge"],
    }),
    createFatwa: builder.mutation<
      ApiResponse<KnowledgeFatwa>,
      Partial<KnowledgeFatwa>
    >({
      query: (body) => ({
        url: "/knowledge-library/fatwas",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Knowledge", "OfflinePack"],
    }),
    updateFatwa: builder.mutation<
      ApiResponse<KnowledgeFatwa>,
      { id: string } & Partial<KnowledgeFatwa>
    >({
      query: ({ id, ...body }) => ({
        url: "/knowledge-library/fatwas/" + id,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Knowledge", "OfflinePack"],
    }),
    deleteFatwa: builder.mutation<ApiResponse<KnowledgeFatwa>, string>({
      query: (id) => ({
        url: "/knowledge-library/fatwas/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Knowledge", "OfflinePack"],
    }),
  }),
});
export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useGetBooksQuery,
  useLazyGetBookQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useGetFatwasQuery,
  useCreateFatwaMutation,
  useUpdateFatwaMutation,
  useDeleteFatwaMutation,
} = knowledgeApi;
