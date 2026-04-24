/* eslint-disable @typescript-eslint/no-explicit-any */
// create slice to store data and remove data of user

import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { RootState } from "../store";

interface UserState {
  user: any;
}

const initialState: UserState = {
  user: null, // Default value
};

// export const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       state.user = action.payload.data;

//       // Save accessToken to localStorage and cookies (client-side only)
//       if (typeof window !== "undefined") {
//         localStorage.setItem("accessToken", action.payload.data?.accessToken);
//         // Set the token in the 'user' cookie that middleware expects
//         Cookies.set("user", action.payload.data);
//         Cookies.set(
//           "token",
//           action.payload.data?.accessToken || action.payload.data
//         );
//       }
//     },
//     removeUser: (state) => {
//       state.user = null;
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("email");
//         Cookies.remove("accessToken");
//         Cookies.remove("user");
//         Cookies.remove("token");
//       }
//     },
//   },
// });

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.data?.accessToken);

        Cookies.set("user", JSON.stringify(action.payload.data));
        Cookies.set("token", action.payload.data?.accessToken);
      }
    },

    removeUser: (state) => {
      state.user = null;

      if (typeof window !== "undefined") {
        localStorage.clear();
        Cookies.remove("user");
        Cookies.remove("token");
      }
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export const selectUserRole = (state: RootState) => state.user.user?.role;
export const selectUser = (state: RootState) => state.user;
export const selectIsLoggedIn = (state: RootState) => !!state.user.user;

export default userSlice.reducer;
