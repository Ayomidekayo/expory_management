import { useQuery } from "@tanstack/react-query";

import { getClient } from "../../api/client.api";

import { queryKeys } from "../../lib/queryKeys";

export function useClient(
  id?: string
) {
  return useQuery({
    queryKey:
      queryKeys.clients.detail(
        id ?? ""
      ),

    queryFn: () =>
      getClient(id!),

    enabled: !!id,
  });
}