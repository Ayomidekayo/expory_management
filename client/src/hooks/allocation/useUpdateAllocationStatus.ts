import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { updateAllocationStatus } from "../../api/allocation.api";

import { queryKeys } from "../../lib/queryKeys";

import type {
  AllocationStatus,
} from "../../types/allocation.types";

export function useUpdateAllocationStatus() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;

      status: AllocationStatus;
    }) =>
      updateAllocationStatus(
        id,
        status
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.allocations.all,
      });

      toast.success(
        "Allocation status updated."
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to update allocation status."
      );
    },
  });
}