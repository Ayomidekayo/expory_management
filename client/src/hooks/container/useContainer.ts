import { useQuery } from "@tanstack/react-query";

import { getContainer } from "../../api/container.api";

export function useContainer(
  id?: string
) {
  return useQuery({

    queryKey: [
      "container",
      id,
    ],

    queryFn: () =>
      getContainer(id!),

    enabled: !!id,

  });
}