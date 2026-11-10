
import { useQuery } from "@tanstack/react-query";

import { getTransports } from "../../api/transport.api";

import type {
  TransportQuery,
} from "../../types/transport";

export function useTransports(
  params?: TransportQuery
) {
  return useQuery({
    queryKey: ["transports", params],

    queryFn: () => getTransports(params),
  });
}
