import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { updateConsignee } from "../../api/consignee.api";

import { queryKeys } from "../../lib/queryKeys";
import type { UpdateConsigneeDto } from "../../types";


interface UpdateConsigneePayload {
  id: string;
  payload: UpdateConsigneeDto;
}

export function useUpdateConsignee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateConsignee,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.consignees.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.consignees.detail(
          variables.id
        ),
      });

      toast.success(
        "Consignee updated successfully."
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to update consignee."
      );
    },
  });
}