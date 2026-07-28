import { useQuery } from "@tanstack/react-query";

import { getConsignee } from "../../api/consignee.api";

import { queryKeys } from "../../lib/queryKeys";

export function useConsignee(
  id?: string
) {
  return useQuery({
    queryKey:
      queryKeys.consignees.detail(
        id ?? ""
      ),

    queryFn: () =>
      getConsignee(id!),

    enabled: !!id,
  });
}