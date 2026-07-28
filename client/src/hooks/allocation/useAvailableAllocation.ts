import { useQuery } from "@tanstack/react-query";
import { getAvailableAllocations } from "../../api/allocation.api";

export const useAvailableAllocations = () => {
  return useQuery({
   allocations: {
  all: ["allocations"] as const,

  detail: (id: string) =>
    ["allocations", id] as const,

  available: () =>
    ["allocations", "available"] as const,
},

    queryFn: getAvailableAllocations,
  });
};