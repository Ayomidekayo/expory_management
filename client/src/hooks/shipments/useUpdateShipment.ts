import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { updateShipment } from "../../api/shipment.api";

export function useUpdateShipment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: updateShipment,

    onSuccess(_, variables) {
      toast.success(
        "Shipment updated successfully."
      );

      queryClient.invalidateQueries({
        queryKey: [
          "shipments",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "shipment",
          variables.id,
        ],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data
          ?.message ??
          "Unable to update shipment."
      );
    },
  });
}