/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const baseURL = process.env.NEXT_PUBLIC_BASEURL as string;

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseURL}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
      const userData = (getState() as RootState).user.user;

      if (userData) {
        // Extract the accessToken from the user data
        const token =
          typeof userData === "object" && userData.accessToken
            ? userData.accessToken
            : userData; // Fallback to the entire token if it's not an object

        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Auth", "Pricing", "Service", "staff", "Review", "Booking", "Support", "client"],
  endpoints: (builder) => ({
    getProfile: builder.query<any, void>({
      query: () => "/profile",
    }),
  }),
});

export const { useGetProfileQuery } = baseApi;
