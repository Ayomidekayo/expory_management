import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  deleteContainer,
} from "../../api/container.api";

export function useDeleteContainer() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn:
      deleteContainer,

    onSuccess() {

      queryClient.invalidateQueries({
        queryKey: [
          "containers",
        ],
      });

      toast.success(
        "Container deleted successfully."
      );

    },

    onError(error: any) {

      toast.error(

        error?.response?.data?.message ??

        "Unable to delete container."

      );

    },

  });

}