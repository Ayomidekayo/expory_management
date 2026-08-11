import { useQuery } from "@tanstack/react-query";

import { getInvoice } from "../../api/invoice.api";

export function useInvoice(id?: string) {
  return useQuery({
    queryKey: ["invoice", id],

    queryFn: async () => {
      const response = await getInvoice(id!);

      console.log(
        "INVOICE DETAIL RESPONSE:",
        response
      );

      console.log(
        "INVOICE ITEMS:",
        response.data?.items
      );

      return response;
    },

    enabled: !!id,
  });
}