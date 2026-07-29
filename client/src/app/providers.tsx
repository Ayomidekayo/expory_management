import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./query-client";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}