import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  deletePackingList,
} from "../../api/packing-list.api";

export function useDeletePackingList() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn:
      deletePackingList,

    onSuccess() {

      queryClient.invalidateQueries({
        queryKey: [
          "packing-lists",
        ],
      });

      toast.success(
        "Packing List deleted successfully."
      );

    },

    onError(error: any) {

      toast.error(
        error?.response?.data?.message ??
          "Unable to delete packing list."
      );

    },

  });

}