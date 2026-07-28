import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";


export const useAssignAllocation =
  () => {

    const queryClient =
      useQueryClient();

    return useMutation({

      mutationFn: ({
        id,
        assignedToId,
      }: any) =>
        assignAllocation(
          id,
          assignedToId
        ),

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey:
            queryKeys.allocations.all,
        });

      },

    });

};