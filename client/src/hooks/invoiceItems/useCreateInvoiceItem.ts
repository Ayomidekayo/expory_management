import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createInvoiceItem,
} from "../../api/auth/invoice-item.api";

import type {
  CreateInvoiceItemDto,
} from "../../types/invoice";

export function useCreateInvoiceItem() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      invoiceId,
      data,
    }: {
      invoiceId: string;
      data: CreateInvoiceItemDto;
    }) => {
      console.log(
        "CREATING INVOICE ITEM"
      );

      console.log(
        "INVOICE ID:",
        invoiceId
      );

      console.log(
        "ITEM DATA:",
        data
      );

      return createInvoiceItem({
        invoiceId,
        data,
      });
    },

    onSuccess: (
      response,
      variables
    ) => {
      console.log(
        "================================="
      );

      console.log(
        "CREATE ITEM SUCCESS"
      );

      console.log(
        "INVOICE ID:",
        variables.invoiceId
      );

      console.log(
        "FULL CREATE RESPONSE:",
        response
      );

      console.log(
        "CREATED ITEM:",
        response.data
      );

      console.log(
        "CREATED ITEM ID:",
        response.data?.id
      );

      console.log(
        "CREATED ITEM INVOICE ID:",
        response.data?.invoiceId
      );

      console.log(
        "================================="
      );

      queryClient.invalidateQueries({
        queryKey: [
          "invoice-items",
          variables.invoiceId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "invoice",
          variables.invoiceId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
    },

    onError: (error) => {
      console.error(
        "CREATE ITEM FAILED:",
        error
      );
    },
  });
}