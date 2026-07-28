import { useQuery } from "@tanstack/react-query";

import { getAllocations } from "../../api/allocation.api";

import { queryKeys } from "../../lib/queryKeys";

import type {
  AllocationQuery,
} from "../../types/allocation.types";

export function useAllocations(
  params?: AllocationQuery
) {
  return useQuery({
    queryKey: [
      ...queryKeys.allocations.all,
      params,
    ],

    queryFn: () =>
      getAllocations(params),
  });
}