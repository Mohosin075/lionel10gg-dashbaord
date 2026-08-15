import { baseApi } from "./baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendNotification: builder.mutation({
      query: (body) => ({
        url: "/notifications/admin/send",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendNotificationMutation } = notificationApi;
