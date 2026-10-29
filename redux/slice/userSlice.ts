import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import type { RootState } from "../store";
export interface AdminSession {
  accessToken: string;
  refreshToken?: string;
  role?: string;
  rememberMe?: boolean;
}
interface UserState {
  user: AdminSession | null;
}
const initialState: UserState = { user: null };
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ data: AdminSession }>) => {
      state.user = action.payload.data;
      if (typeof window !== "undefined") {
        Cookies.set("token", action.payload.data.accessToken, {
          path: "/",
          sameSite: "lax",
          secure: window.location.protocol === "https:",
          ...(action.payload.data.rememberMe ? { expires: 30 } : {}),
        });
        Cookies.remove("user", { path: "/" });
        localStorage.removeItem("accessToken");
      }
    },
    removeUser: (state) => {
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("persist:root");
        sessionStorage.removeItem("resetToken");
        Cookies.remove("user", { path: "/" });
        Cookies.remove("token", { path: "/" });
      }
    },
  },
});
export const { setUser, removeUser } = userSlice.actions;
export const selectUserRole = (state: RootState) => state.user.user?.role;
export const selectUser = (state: RootState) => state.user;
export const selectIsLoggedIn = (state: RootState) =>
  Boolean(state.user.user?.accessToken);
export default userSlice.reducer;
