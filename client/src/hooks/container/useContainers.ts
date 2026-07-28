import { useQuery } from "@tanstack/react-query";

import { getContainers } from "../../api/container.api";
import type { ContainerQuery } from "../../types/container.type";


export function useContainers(
  params?: ContainerQuery
) {
  return useQuery({

    queryKey: [
      "containers",
      params,
    ],

    queryFn: () =>
      getContainers(params),

  });
}