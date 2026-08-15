import { baseApi } from "../baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/auth/admin-login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth", "Profile"],
    }),

    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: data,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-account",
        method: "POST",
        body: data,
      }),
    }),

    resendOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({
        token,
        newPassword,
        confirmPassword,
      }: {
        token: string;
        newPassword: string;
        confirmPassword: string;
      }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { newPassword, confirmPassword },
        headers: {
          Authorization: token,
        },
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useForgetPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
} = authApi;
