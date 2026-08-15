import { baseApi } from "./baseApi";

export const knowledgeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: (params) => ({
        url: "/knowledge-library",
        params,
      }),
      providesTags: ["Knowledge"],
    }),
    createArticle: builder.mutation({
      query: (data) => ({
        url: "/knowledge-library",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Knowledge"],
    }),
    updateArticle: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/knowledge-library/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Knowledge"],
    }),
    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `/knowledge-library/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Knowledge"],
    }),

    getBooks: builder.query({
      query: (params) => ({
        url: "/knowledge-library/books",
        params,
      }),
      providesTags: ["Knowledge"],
    }),
    createBook: builder.mutation({
      query: (data) => ({
        url: "/knowledge-library/books",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Knowledge"],
    }),
    updateBook: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/knowledge-library/books/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Knowledge"],
    }),
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/knowledge-library/books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Knowledge"],
    }),

    getFatwas: builder.query({
      query: (params) => ({
        url: "/knowledge-library/fatwas",
        params,
      }),
      providesTags: ["Knowledge"],
    }),
    createFatwa: builder.mutation({
      query: (data) => ({
        url: "/knowledge-library/fatwas",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Knowledge"],
    }),
    updateFatwa: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/knowledge-library/fatwas/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Knowledge"],
    }),
    deleteFatwa: builder.mutation({
      query: (id) => ({
        url: `/knowledge-library/fatwas/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Knowledge"],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useGetBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useGetFatwasQuery,
  useCreateFatwaMutation,
  useUpdateFatwaMutation,
  useDeleteFatwaMutation,
} = knowledgeApi;
