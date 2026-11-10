import { useQuery } from "@tanstack/react-query";
import { getTransportPayments } from "../../api/transport.api";

export function useTransportPayments(itemId?: string) {
  return useQuery({
    queryKey: ["transport-payments", itemId],
    queryFn: () => getTransportPayments(itemId!),
    enabled: Boolean(itemId),
  });
}