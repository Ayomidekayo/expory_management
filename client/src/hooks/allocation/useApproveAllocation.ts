import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateAllocationStatus } from "../../api/allocation.api";
import { queryKeys } from "../../lib/queryKeys";

export const useApproveAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      updateAllocationStatus(id, "APPROVED"),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.allocations.all,
      });
    },
  });
};