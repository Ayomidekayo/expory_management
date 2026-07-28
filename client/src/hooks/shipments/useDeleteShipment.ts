import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { deleteShipment } from "../../api/shipment.api";

export function useDeleteShipment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteShipment,

    onSuccess() {
      toast.success(
        "Shipment deleted successfully."
      );

      queryClient.invalidateQueries({
        queryKey: [
          "shipments",
        ],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data
          ?.message ??
          "Unable to delete shipment."
      );
    },
  });
}