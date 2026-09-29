import {
  useQuery,
} from "@tanstack/react-query";

import {
  getShipmentStatusCounts,
} from "../../api/shipment.api";

export function useShipmentStatusCounts() {
  return useQuery({
    queryKey: ["shipment-status-counts"],

    queryFn: getShipmentStatusCounts,
  });
}