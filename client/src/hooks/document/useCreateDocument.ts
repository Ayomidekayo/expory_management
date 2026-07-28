import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import { createDocument } from "../../api/document.api";

export function useCreateDocument() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: createDocument,

    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey: [
          "documents",
        ],

      });

    },

  });

}