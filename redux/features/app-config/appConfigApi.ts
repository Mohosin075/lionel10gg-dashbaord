import { baseApi } from "../baseApi";

export interface IBanner {
  id: string;
  title: string;
  imageUrl: string;
  actionUrl?: string;
  isActive: boolean;
  order?: number;
}

export interface IAppConfig {
  banners: IBanner[];
  maintenanceMode: {
    isEnabled: boolean;
    message: string;
    minAppVersion?: string;
  };
  dailyReminder: {
    isEnabled: boolean;
    message: string;
    time?: string;
  };
  featureFlags: {
    premiumEnabled: boolean;
    audioStreamingEnabled: boolean;
    aiChatEnabled: boolean;
  };
}

export const appConfigApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppConfig: builder.query<{ success: boolean; data: IAppConfig }, void>({
      query: () => "/app-config",
      providesTags: ["AppConfig"],
    }),
    updateAppConfig: builder.mutation<
      { success: boolean; data: IAppConfig; message: string },
      Partial<IAppConfig>
    >({
      query: (body) => ({
        url: "/app-config",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AppConfig"],
    }),
  }),
});

export const { useGetAppConfigQuery, useUpdateAppConfigMutation } = appConfigApi;
