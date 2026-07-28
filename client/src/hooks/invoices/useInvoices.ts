import { useQuery } from "@tanstack/react-query";

import { getInvoices } from "../../api/invoice.api";
import type { InvoiceQuery } from "../../validations/invoice.validation";


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