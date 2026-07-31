import { useQuery } from "@tanstack/react-query";
import type { ShipmentQuery } from "../../types/shipment.types";
import { getAvailableShipments } from "../../api/shipment.api";

export function useAvailableShipments(
  params?: ShipmentQuery
) {
  return useQuery({
    queryKey: [
      "available-shipments",
      params,
    ],

    queryFn: () =>
      getAvailableShipments(params),
  });
}