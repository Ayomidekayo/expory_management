import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { updateTransit } from "../../api/transit.api";

export function useUpdateTransit() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: updateTransit,

    onSuccess: (_, variables) => {

      toast.success(
        "Transit updated successfully."
      );

      queryClient.invalidateQueries({

        queryKey: ["transits"],

      });

      queryClient.invalidateQueries({

        queryKey: [
          "transit",
          variables.id,
        ],

      });

    },

    onError: (error: any) => {

      toast.error(

        error?.response?.data?.message ||

        "Failed to update transit."

      );

    },

  });

}