import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTransit } from "../../api/transit.api";

import { toast } from "sonner";

export function useDeleteTransit() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: deleteTransit,

    onSuccess: () => {

      toast.success(
        "Transit deleted successfully."
      );

      queryClient.invalidateQueries({
        queryKey: ["transits"],
      });

    },

    onError: (error: any) => {

      toast.error(
        error?.response?.data?.message ??
          "Failed to delete transit."
      );

    },

  });

}