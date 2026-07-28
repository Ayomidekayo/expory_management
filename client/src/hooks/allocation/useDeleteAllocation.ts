import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { deleteAllocation } from "../../api/allocation.api";

import { queryKeys } from "../../lib/queryKeys";

export function useDeleteAllocation() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteAllocation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.allocations.all,
      });

      toast.success(
        "Allocation deleted successfully."
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to delete allocation."
      );
    },
  });
}