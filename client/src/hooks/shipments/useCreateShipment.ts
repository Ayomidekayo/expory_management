import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { createShipment } from "../../api/shipment.api";

export function useCreateShipment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createShipment,

    onSuccess() {
      toast.success(
        "Shipment created successfully."
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
          "Unable to create shipment."
      );
    },
  });
}