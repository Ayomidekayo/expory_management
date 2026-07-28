import { useQuery } from "@tanstack/react-query";

import { getClients } from "../../api/client.api";
import { queryKeys } from "../../lib/queryKeys";

import type { ClientQuery } from "../../types/client.types";

export function useClients(
  params?: ClientQuery
) {
  return useQuery({
    queryKey: [
      ...queryKeys.clients.all,
      params,
    ],

    queryFn: () => getClients(params),
  });
}