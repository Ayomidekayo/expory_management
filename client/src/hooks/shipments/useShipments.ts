import { useQuery } from "@tanstack/react-query";
import type { ShipmentQuery } from "../../types/shipment.types";
import { getShipments } from "../../api/shipment.api";

export function useShipments(
  params?: ShipmentQuery
) {
  return useQuery({
    queryKey: [
      "shipments",
      params,
    ],
    queryFn: () =>
      getShipments(params),
  });
}