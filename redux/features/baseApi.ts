/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const baseURL = process.env.NEXT_PUBLIC_BASEURL as string;

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseURL}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
      if (headers.has("authorization") || headers.has("Authorization")) {
        return headers;
      }

      const userData = (getState() as RootState).user.user;

      if (userData) {
        const token =
          typeof userData === "object" && userData.accessToken
            ? userData.accessToken
            : userData;

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: [
    "Auth",
    "User",
    "Profile",
    "Dashboard",
    "SubscriptionPlan",
    "PremiumBenefit",
    "SubscriptionAnalytics",
    "Article",
    "Knowledge",
    "Sheikh",
    "Benefit",
  ],
  endpoints: () => ({}),
});
