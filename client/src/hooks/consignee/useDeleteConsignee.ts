import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteConsignee } from "../../api/consignee.api";

export function useDeleteConsignee() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      deleteConsignee,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [
          "consignees",
        ],
      });
    },
  });
}