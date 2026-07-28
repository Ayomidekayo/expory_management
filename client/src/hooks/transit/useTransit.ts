import { useQuery } from "@tanstack/react-query";

import { getTransit } from "../../api/transit.api";

export function useTransit(
  id?: string
) {
  return useQuery({

    queryKey: [
      "transit",
      id,
    ],

    queryFn: () =>
      getTransit(id!),

    enabled: !!id,

  });
}