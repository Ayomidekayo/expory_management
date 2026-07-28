import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createPackingList } from "../../api/packing-list.api";

export function useCreatePackingList() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn:
      createPackingList,

    onSuccess() {

      queryClient.invalidateQueries({
        queryKey: [
          "packing-lists",
        ],
      });

      toast.success(
        "Packing list created successfully."
      );

    },

    onError(error: any) {

      toast.error(
        error?.response?.data?.message ??
        "Unable to create packing list."
      );

    },

  });

}