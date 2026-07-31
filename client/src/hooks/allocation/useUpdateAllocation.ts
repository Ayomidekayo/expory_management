import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { updateAllocation } from "../../api/allocation.api";

import { queryKeys } from "../../lib/queryKeys";


export function useUpdateAllocation() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: updateAllocation,

    onSuccess: (
      _,
      variables
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.allocations.all,
      });

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.allocations.detail(
            variables.id
          ),
      });

      toast.success(
        "Allocation updated successfully."
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to update allocation."
      );
    },
  });
}