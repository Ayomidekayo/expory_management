import { useQuery } from "@tanstack/react-query";

import { getInvoices } from "../../api/invoice.api";
import type { InvoiceQuery } from "../../types/invoice";



export function useInvoices(
  params?: InvoiceQuery
) {
  return useQuery({
    queryKey: [
      "invoices",
      params,
    ],

    queryFn: () =>
      getInvoices(params),
  });
}