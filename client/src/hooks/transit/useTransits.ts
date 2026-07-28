import { useQuery } from "@tanstack/react-query";

import { getTransits } from "../../api/transit.api";



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