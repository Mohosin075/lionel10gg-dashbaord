import { baseApi } from "./baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendNotification: builder.mutation<{success:boolean;data:{recorded:number;push:{configured:boolean;attempted:number;accepted:number;failed:number}}},{title:string;message:string;userId?:string}>({
      query: (body) => ({
        url: "/notifications/admin/send",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendNotificationMutation } = notificationApi;
