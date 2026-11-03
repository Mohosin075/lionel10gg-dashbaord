import { baseApi } from "../baseApi";

export interface PublicPolicyItem {
  _id?: string;
  type: string;
  title: string;
  content: string;
  category?: string;
  description?: string;
  isDefault?: boolean;
  lastUpdated?: string;
  updatedAt?: string;
}

export interface PublicPolicyResponse {
  success: boolean;
  message: string;
  data: PublicPolicyItem;
}

export interface PublicPolicyListResponse {
  success: boolean;
  message: string;
  data: PublicPolicyItem[];
}

export interface UpdatePublicPolicyPayload {
  type: string;
  content: string;
  title?: string;
}

export const publicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicPolicy: builder.query<PublicPolicyResponse, string>({
      query: (type) => `/public/${type}`,
      providesTags: (result, error, type) => [{ type: "PublicPolicy", id: type }],
    }),
    listPublicPolicies: builder.query<PublicPolicyListResponse, void>({
      query: () => "/public/list",
      providesTags: ["PublicPolicy"],
    }),
    updatePublicPolicy: builder.mutation<PublicPolicyResponse, UpdatePublicPolicyPayload>({
      query: (body) => ({
        url: "/public",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { type }) => [
        "PublicPolicy",
        { type: "PublicPolicy", id: type },
      ],
    }),
  }),
});

export const {
  useGetPublicPolicyQuery,
  useListPublicPoliciesQuery,
  useUpdatePublicPolicyMutation,
} = publicApi;

