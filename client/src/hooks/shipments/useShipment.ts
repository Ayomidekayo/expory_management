import { useQuery } from "@tanstack/react-query";

import { getShipment } from "../../api/shipment.api";

export function useShipment(
  id?: string
) {
  return useQuery({
    queryKey: [
      "shipment",
      id,
    ],

    queryFn: () =>
      getShipment(id!),

    enabled: !!id,
  });
}