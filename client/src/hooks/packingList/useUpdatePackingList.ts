import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updatePackingList } from "../../api/packing-list.api";
import { toast } from "sonner";

export function useUpdatePackingList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;

      payload: any;
    }) =>
      updatePackingList(id, payload),

    onSuccess(_, variables) {
      queryClient.invalidateQueries({
        queryKey: ["packing-lists"],
      });

       toast.success(
        "Packing list created successfully."
      );

   

      queryClient.invalidateQueries({
        queryKey: [
          "packing-list",
          variables.id,
        ],
      });


      
    },
     onError(error: any) {

      toast.error(
        error?.response?.data?.message ??
        "Unable to create packing list."
      );

    },
  });
}