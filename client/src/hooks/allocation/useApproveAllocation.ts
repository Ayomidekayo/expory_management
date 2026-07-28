import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { approveAllocation } from "../../api/allocation.api";
import { queryKeys } from "../../lib/queryKeys";

export const useApproveAllocation =
  () => {

    const queryClient =
      useQueryClient();

    return useMutation({

      mutationFn:
        approveAllocation,

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey:
            queryKeys.allocations.all,
        });

      },

    });

};