import { useQuery } from "@tanstack/react-query";

import { getPackingLists } from "../../api/packing-list.api";
import type { PackingListQuery } from "../../types/packing-list";


export function usePackingLists(
  params?: PackingListQuery
) {
  return useQuery({
    queryKey: [
      "packing-lists",
      params,
    ],

    queryFn: () =>
      getPackingLists(params),
  });
}