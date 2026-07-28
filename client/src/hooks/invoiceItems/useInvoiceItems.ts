import { useQuery } from "@tanstack/react-query";
import { getInvoiceItems } from "../../api/auth/invoice-item.api";


export function useInvoiceItems(
  invoiceId: string
) {
  return useQuery({
    queryKey: [
      "invoice-items",
      invoiceId,
    ],

    queryFn: () =>
      getInvoiceItems(invoiceId),

    enabled: !!invoiceId,
  });
}