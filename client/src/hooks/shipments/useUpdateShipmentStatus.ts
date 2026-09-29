import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateShipmentStatus,
} from "../../api/shipment.api";

import type { Shipment } from "../../types/shipment.types";

export interface UpdateShipmentStatusVariables {
  id: string;
  status: Shipment["status"];
}

export function useUpdateShipmentStatus() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      variables: UpdateShipmentStatusVariables
    ) =>
      updateShipmentStatus(variables),

    onSuccess: (
      _data,
      variables
    ) => {
      /*
       * Refresh all shipment lists.
       *
       * This is especially important when a
       * shipment changes from an active status
       * to COMPLETED.
       */
      queryClient.invalidateQueries({
        queryKey: ["shipments"],
      });

      /*
       * Refresh dashboard status counts.
       */
      queryClient.invalidateQueries({
        queryKey: [
          "shipment-status-counts",
        ],
      });

      /*
       * Refresh the individual shipment.
       */
      queryClient.invalidateQueries({
        queryKey: [
          "shipment",
          variables.id,
        ],
      });
    },
  });
}