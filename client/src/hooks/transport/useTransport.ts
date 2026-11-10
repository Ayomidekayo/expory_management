


import { useQuery } from "@tanstack/react-query";
import { getTransport } from "../../api/transport.api";

export function useTransport(id?: string) {
  return useQuery({
    queryKey: ["transports", id],
    queryFn: () => getTransport(id!),
    enabled: Boolean(id),
  });
}