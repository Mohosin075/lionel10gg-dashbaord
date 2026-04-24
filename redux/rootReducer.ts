import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "./features/baseApi";
import userReducer from "./slice/userSlice";

// Combine all reducers
export const rootReducer = combineReducers({
  user: userReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
