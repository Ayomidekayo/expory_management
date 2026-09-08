import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";

export function useExporterDocuments(
  exporterId?: string
) {
  return useQuery({
    queryKey: [
      "documents",
      "exporter",
      exporterId,
    ],

    queryFn: async () => {
      const response = await api.get(
        "/documents",
        {
          params: {
            exporterId,
          },
        }
      );

      return response.data;
    },

    enabled: Boolean(exporterId),
  });
}