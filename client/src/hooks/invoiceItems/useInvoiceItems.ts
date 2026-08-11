import { useQuery } from "@tanstack/react-query";

import {
  getInvoiceItems,
} from "../../api/auth/invoice-item.api";

export function useInvoiceItems(
  invoiceId?: string
) {
  return useQuery({
    queryKey: [
      "invoice-items",
      invoiceId,
    ],

    queryFn: async () => {
      console.log(
        "================================="
      );

      console.log(
        "GETTING ITEMS FOR INVOICE:",
        invoiceId
      );

      const response =
        await getInvoiceItems(invoiceId!);

      console.log(
        "FULL INVOICE ITEMS RESPONSE:",
        response
      );

      console.log(
        "ITEMS DATA:",
        response.data
      );

      console.log(
        "ITEM COUNT:",
        response.data?.length
      );

      console.table(
        response.data?.map((item) => ({
          id: item.id,
          invoiceId: item.invoiceId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        }))
      );

      console.log(
        "================================="
      );

      return response;
    },

    enabled: !!invoiceId,
  });
}