import { useQuery } from "@tanstack/react-query";

import { getInvoice } from "../../api/invoice.api";

export function useInvoice(
  id?: string
) {
  return useQuery({
    queryKey: [
      "invoice",
      id,
    ],

    queryFn: () =>
      getInvoice(id!),

    enabled: !!id,
  });
}