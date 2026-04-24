import { baseApi } from "../baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // login user
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // forgot password
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // verify otp
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-account",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // resend otp
    resendOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-account",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useForgetPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
} = authApi;

