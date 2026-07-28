import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createConsignee } from "../../api/consignee.api";

export function useCreateConsignee() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      createConsignee,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [
          "consignees",
        ],
      });
    },
  });
}