import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/router.jsx";
import AuthProvider from "./provider/AuthProvider.jsx";
import UIStateProvider from "./provider/UIStateProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" containerStyle={{ zIndex: 999999 }} />
      <AuthProvider>
        <UIStateProvider>
          <RouterProvider router={router} />
        </UIStateProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);
