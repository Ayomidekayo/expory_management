
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createTransportPayment,
  getTransportPayments,
  type TransportPaymentPayload,
} from "../../api/transport.api";


export function useTransportPayments(
  itemId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["transport-payments", itemId],
    queryFn: () => getTransportPayments(itemId),
    enabled: Boolean(itemId) && enabled,
  });
}

export function useCreateTransportPayment(transportId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: TransportPaymentPayload;
    }) => createTransportPayment(itemId, payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transports", transportId],
      });

      queryClient.invalidateQueries({
        queryKey: ["transport-payments", variables.itemId],
      });

      queryClient.invalidateQueries({
        queryKey: ["transports"],
      });

      toast.success("Payment recorded successfully.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Unable to record payment.",
      );
    },
  });
}

import { updateTransportItemLock } from "../../api/transport.api";

export function useTransportItemLock(transportId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      isLocked,
    }: {
      itemId: string;
      isLocked: boolean;
    }) => updateTransportItemLock(itemId, isLocked),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["transports", transportId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["transports"],
        }),
      ]);

      toast.success(
        variables.isLocked
          ? "Transport item locked successfully."
          : "Transport item unlocked successfully.",
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to update transport item lock.",
      );
    },
  });
}

