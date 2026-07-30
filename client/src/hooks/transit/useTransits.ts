import { useQuery } from "@tanstack/react-query";

import { getTransits } from "../../api/transit.api";
import type { TransitQuery } from "../../types/transit.type";

export function useTransits(
  params?: TransitQuery
) {
  return useQuery({

    queryKey: [
      "transits",
      params,
    ],

    queryFn: () =>
      getTransits(params),

  });
}