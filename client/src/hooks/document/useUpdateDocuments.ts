import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import {
  updateDocument,
} from "../../api/document.api";

export function useUpdateDocument() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn:
      updateDocument,

    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey: [
          "documents",
        ],

      });

    },

  });

}