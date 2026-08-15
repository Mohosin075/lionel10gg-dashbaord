import { baseApi } from "../baseApi";

export type SubscriptionPlan = {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: "month" | "year" | "lifetime";
  intervalCount?: number;
  features: string[];
  isActive?: boolean;
  stripePriceId?: string;
  stripeProductId?: string;
  priority?: number;
};

export type PremiumBenefit = {
  _id: string;
  serialNumber: number;
  text: string;
  isActive: boolean;
};

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPlans: builder.query<any, void>({
      query: () => "/subscription/admin/plans",
      providesTags: ["SubscriptionPlan"],
    }),

    createPlan: builder.mutation({
      query: (body) => ({
        url: "/subscription/admin/plans",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SubscriptionPlan"],
    }),

    updatePlan: builder.mutation({
      query: ({
        planId,
        ...body
      }: {
        planId: string;
        name?: string;
        description?: string;
        features?: string[];
        isActive?: boolean;
        priority?: number;
      }) => ({
        url: `/subscription/admin/plans/${planId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["SubscriptionPlan"],
    }),

    deletePlan: builder.mutation({
      query: (planId: string) => ({
        url: `/subscription/admin/plans/${planId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubscriptionPlan"],
    }),

    getAdminPremiumBenefits: builder.query<any, void>({
      query: () => "/subscription/admin/premium-benefits",
      providesTags: ["PremiumBenefit"],
    }),

    createPremiumBenefit: builder.mutation({
      query: (body: {
        serialNumber: number;
        text: string;
        isActive?: boolean;
      }) => ({
        url: "/subscription/admin/premium-benefits",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PremiumBenefit"],
    }),

    updatePremiumBenefit: builder.mutation({
      query: ({
        id,
        ...body
      }: {
        id: string;
        serialNumber?: number;
        text?: string;
        isActive?: boolean;
      }) => ({
        url: `/subscription/admin/premium-benefits/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PremiumBenefit"],
    }),

    deletePremiumBenefit: builder.mutation({
      query: (id: string) => ({
        url: `/subscription/admin/premium-benefits/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PremiumBenefit"],
    }),

    getSubscriptionAnalytics: builder.query<any, void>({
      query: () => "/subscription/admin/analytics",
      providesTags: ["SubscriptionAnalytics"],
    }),
  }),
});

export const {
  useGetAdminPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useGetAdminPremiumBenefitsQuery,
  useCreatePremiumBenefitMutation,
  useUpdatePremiumBenefitMutation,
  useDeletePremiumBenefitMutation,
  useGetSubscriptionAnalyticsQuery,
} = subscriptionApi;
