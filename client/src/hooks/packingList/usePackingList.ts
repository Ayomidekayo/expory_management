import { useQuery } from "@tanstack/react-query";

import { getPackingList } from "../../api/packing-list.api";

export function usePackingList(id?: string) {
  return useQuery({
    queryKey: ["packing-list", id],

    queryFn: () => getPackingList(id!),

    enabled: !!id,
  });
}