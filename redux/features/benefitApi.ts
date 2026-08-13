import { baseApi } from "./baseApi";

export const benefitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBenefits: builder.query({
      query: () => ({
        url: "/subscription/admin/premium-benefits",
      }),
      providesTags: ["Benefit"],
    }),
    createBenefit: builder.mutation({
      query: (data) => ({
        url: "/subscription/admin/premium-benefits",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Benefit"],
    }),
    updateBenefit: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subscription/admin/premium-benefits/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Benefit"],
    }),
    deleteBenefit: builder.mutation({
      query: (id) => ({
        url: `/subscription/admin/premium-benefits/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Benefit"],
    }),
  }),
});

export const {
  useGetBenefitsQuery,
  useCreateBenefitMutation,
  useUpdateBenefitMutation,
  useDeleteBenefitMutation,
} = benefitApi;
