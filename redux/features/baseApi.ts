import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { removeUser, setUser } from "../slice/userSlice";
import type { RootState } from "../store";
const baseURL = (
  process.env.NEXT_PUBLIC_BASEURL || "http://localhost:5005"
).replace(/\/$/, "");
const rawQuery = fetchBaseQuery({
  baseUrl: baseURL + "/api/v1",
  timeout: 30000,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.user?.accessToken;
    if (token && !headers.has("authorization"))
      headers.set("Authorization", "Bearer " + token);
    return headers;
  },
});
let refreshFlight: Promise<"ok" | "rejected" | "unavailable"> | null = null;
const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, options) => {
  const startingSession = (api.getState() as RootState).user.user;
  let result = await rawQuery(args, api, options);
  const url = typeof args === "string" ? args : args.url;
  if (result.error?.status !== 401 || url.startsWith("/auth/")) return result;
  const session = (api.getState() as RootState).user.user;
  if (startingSession?.refreshToken !== session?.refreshToken) return result;
  if (
    session?.accessToken &&
    session.accessToken !== startingSession?.accessToken
  )
    return rawQuery(args, api, options);
  if (!refreshFlight) {
    refreshFlight = (async () => {
      if (!session?.refreshToken) return "rejected" as const;
      const refreshed = await rawQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken: session.refreshToken },
        },
        api,
        options,
      );
      if (
        (api.getState() as RootState).user.user?.accessToken !==
        session.accessToken
      )
        return "unavailable" as const;
      if (refreshed.error)
        return refreshed.error.status === 401 || refreshed.error.status === 403
          ? ("rejected" as const)
          : ("unavailable" as const);
      const payload = refreshed.data as { data?: { accessToken?: string } };
      if (!payload.data?.accessToken) return "rejected" as const;
      api.dispatch(
        setUser({
          data: { ...session, accessToken: payload.data.accessToken },
        }),
      );
      return "ok" as const;
    })().finally(() => {
      refreshFlight = null;
    });
  }
  const outcome = await refreshFlight;
  if (outcome === "ok") result = await rawQuery(args, api, options);
  if (
    outcome === "rejected" ||
    (outcome === "ok" && result.error?.status === 401)
  ) {
    api.dispatch(removeUser());
    api.dispatch(baseApi.util.resetApiState());
    if (typeof window !== "undefined" && window.location.pathname !== "/login")
      window.location.replace(
        "/login?redirect=" +
          encodeURIComponent(window.location.pathname + window.location.search),
      );
  }
  return result;
};
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
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
    "OfflinePack",
    "BatchTranslation",
    "Hadith",
    "Dua",
    "AppConfig",
  ],
  endpoints: () => ({}),
});
