"use client";
import { Provider } from "react-redux";

import { Toaster } from "sonner";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <Toaster position="top-center" />
      </PersistGate>
    </Provider>
  );
}