import { useQuery } from "@tanstack/react-query";

import { getExporters } from "../../api/exporter.api";
import { queryKeys } from "../../lib/queryKeys";
import type { ExporterQuery } from "../../types/exporter.types";


export function useExporters(
  params?: ExporterQuery
) {
  return useQuery({
    queryKey: queryKeys.exporters.list(params),

    queryFn: () => getExporters(params),
  });
}