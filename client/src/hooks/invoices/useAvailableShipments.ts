// hooks/shipment/useAvailableShipments.ts

import { useQuery } from "@tanstack/react-query";

import { getAvailableShipments } from "../../api/shipment.api";

export function useAvailableShipments() {
  return useQuery({
    queryKey: ["available-shipments"],

queryFn: () => getAvailableShipments(),
  });
}