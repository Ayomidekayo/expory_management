import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getTransportColumnLocks,
  updateTransportColumnLock,
} from "../../api/transport.api";

import type { TransportColumnKey } from "../../types/transport";

export function useTransportColumnLocks() {
  return useQuery({
    queryKey: ["transport-column-locks"],
    queryFn: getTransportColumnLocks,
    staleTime: 30_000,
  });
}

export function useUpdateTransportColumnLock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      columnKey,
      payload,
    }: {
      columnKey: TransportColumnKey;
      payload: {
        isLocked: boolean;
        lockReason?: string;
      };
    }) => updateTransportColumnLock(columnKey, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transport-column-locks"],
      });

      toast.success("Column lock updated successfully.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to update column lock.",
      );
    },
  });
}