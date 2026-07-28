import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  createContainer,
} from "../../api/container.api";

export function useCreateContainer() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn:
      createContainer,

    onSuccess() {

      queryClient.invalidateQueries({
        queryKey: [
          "containers",
        ],
      });

      toast.success(
        "Container created successfully."
      );

    },

    onError(error: any) {

      toast.error(

        error?.response?.data?.message ??

        "Unable to create container."

      );

    },

  });

}