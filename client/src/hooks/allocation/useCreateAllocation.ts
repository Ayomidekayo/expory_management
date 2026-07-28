import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { createAllocation } from "../../api/allocation.api";

import { queryKeys } from "../../lib/queryKeys";

export function useCreateAllocation() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createAllocation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.allocations.all,
      });

      toast.success(
        "Allocation created successfully."
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to create allocation."
      );
    },
  });
}