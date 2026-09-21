import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createInvoicePayment, deleteInvoicePayment, getInvoicePayments, updateInvoicePayment } from "../../api/invoice-payment.api";



export function useInvoicePayments(
  invoiceId?: string
) {
  return useQuery({
    queryKey: [
      "invoice-payments",
      invoiceId,
    ],

    queryFn: () =>
      getInvoicePayments(invoiceId!),

    enabled: Boolean(invoiceId),

    staleTime: 30 * 1000,
  });
}

export function useCreateInvoicePayment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createInvoicePayment,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "invoice-payments",
          variables.invoiceId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "invoice",
          variables.invoiceId,
        ],
      });
    },
  });
}

export function useUpdateInvoicePayment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      invoiceId,
      data,
    }: {
      id: string;
      invoiceId: string;
      data: Parameters<
        typeof updateInvoicePayment
      >[1];
    }) =>
      updateInvoicePayment(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "invoice-payments",
          variables.invoiceId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "invoice",
          variables.invoiceId,
        ],
      });
    },
  });
}

export function useDeleteInvoicePayment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      invoiceId,
    }: {
      id: string;
      invoiceId: string;
    }) => deleteInvoicePayment(id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "invoice-payments",
          variables.invoiceId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "invoice",
          variables.invoiceId,
        ],
      });
    },
  });
}