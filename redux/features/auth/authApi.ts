import { removeUser } from "../../slice/userSlice";
import { baseApi } from "../baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // create user
    signUpUser: builder.mutation({
      query: (data) => ({
        url: `/auth/signup`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // login user
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // verify user
    verifyUser: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-account",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // verify user
    resendOTP: builder.mutation({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // verify user
    forgetPasswordSendOTP: builder.mutation({
      query: (data) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ✅ Reset password (with token in headers)
    setNewPassword: builder.mutation({
      query: ({ token, body }) => ({
        url: `/auth/reset-password?token=${token}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

  changePassword: builder.mutation({
    query: (data) => ({
      url: "/auth/change-password",
      method: "POST",
      body: data,
    }),
    invalidatesTags: ["Auth"],
  }),

    // logout user
    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Clear RTK Query cache
          dispatch(baseApi.util.resetApiState());
          // Clear Redux user state
          dispatch(removeUser()); // This will clear your user slice
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
  }),
});

export const {
  useSignUpUserMutation,
  useVerifyUserMutation,
  useForgetPasswordSendOTPMutation,
  useResendOTPMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useSetNewPasswordMutation,
  useChangePasswordMutation
} = authApi;
