import { useQuery } from "@tanstack/react-query";

import { getExporter } from "../../api/exporter.api";

import { queryKeys } from "../../lib/queryKeys";

export function useExporter(
  id?: string
) {
  return useQuery({
    queryKey:
      queryKeys.exporters.detail(
        id ?? ""
      ),

    queryFn: () =>
      getExporter(id!),

    enabled: !!id,
  });
}