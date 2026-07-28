import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../lib/react-query";
import { assignOfficer } from "../../api/allocation.api";


export function useAssignOfficer() {
  return useMutation({
    mutationFn: ({
      id,
      assignedToId,
    }: {
      id: string;
      assignedToId: string;
    }) => assignOfficer(id, assignedToId),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["allocations"],
      });
    },
  });
}