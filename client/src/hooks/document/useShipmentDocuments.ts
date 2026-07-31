import { useQuery } from "@tanstack/react-query";

import { getDocuments } from "../../api/document.api";

export function useShipmentDocuments(
  shipmentId?: string
) {
  return useQuery({
    queryKey: ["shipment-documents", shipmentId],

    queryFn: async () => {
      const response = await getDocuments({
        shipmentId,
      });

      return response.data;
    },

    enabled: !!shipmentId,
  });
}