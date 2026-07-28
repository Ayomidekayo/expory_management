import { QueryClientProvider } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";

import { router } from "./routes/router";

import "./index.css";
import React from "react";
import { queryClient } from "./lib/react-query";
import { Toaster } from "sonner";
import "./index.css";
import AuthInitializer from "./components/auth/AuthInitializer";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <Toaster richColors position="top-right" />
 <AuthInitializer />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
