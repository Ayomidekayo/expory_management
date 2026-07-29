import { useQuery } from "@tanstack/react-query";
import { getAllocation } from "../../api/allocation.api";
import { queryKeys } from "../../lib/queryKeys";

export function useAllocation(
  id?: string
) {
  return useQuery({
    queryKey:
      queryKeys.allocations.detail(
        id ?? ""
      ),

    queryFn: () =>
      getAllocation(id!),

    enabled: !!id,
  });
}