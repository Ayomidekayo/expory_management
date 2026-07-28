import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { deleteExporter } from "../../api/exporter.api";

import { queryKeys } from "../../lib/queryKeys";

export function useDeleteExporter() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteExporter,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.exporters.all,
      });

      toast.success(
        "Exporter deleted successfully."
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to delete exporter."
      );
    },
  });
}