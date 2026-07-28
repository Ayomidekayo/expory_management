import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { createTransit } from "../../api/transit.api";

export function useCreateTransit() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: createTransit,

    onSuccess: () => {

      toast.success(
        "Transit created successfully."
      );

      queryClient.invalidateQueries({

        queryKey: ["transits"],

      });

    },

    onError: (error: any) => {

      toast.error(

        error?.response?.data?.message ||

        "Failed to create transit."

      );

    },

  });

}