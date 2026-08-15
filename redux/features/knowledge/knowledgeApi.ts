import { baseApi } from "../baseApi";

export type KnowledgeArticle = {
  _id: string;
  articleId: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  readTime: number;
  imageUrl?: string;
  audioUrl?: string;
  lang: string;
  source: "islamhouse" | "manual";
  version?: number;
  isActive?: boolean;
};

const knowledgeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query<
      any,
      {
        lang?: string;
        category?: string;
        page?: number;
        limit?: number;
      } | void
    >({
      query: (params) => ({
        url: "/knowledge-library",
        params: {
          lang: params?.lang ?? "de",
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
          ...(params?.category ? { category: params.category } : {}),
        },
      }),
      providesTags: ["Article"],
    }),

    getArticle: builder.query({
      query: (id: string) => `/knowledge-library/${id}`,
      providesTags: ["Article"],
    }),

    createArticle: builder.mutation({
      query: (body) => ({
        url: "/knowledge-library",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Article"],
    }),

    updateArticle: builder.mutation({
      query: ({ id, ...body }: { id: string } & Partial<KnowledgeArticle>) => ({
        url: `/knowledge-library/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Article"],
    }),

    deleteArticle: builder.mutation({
      query: (id: string) => ({
        url: `/knowledge-library/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Article"],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = knowledgeApi;
