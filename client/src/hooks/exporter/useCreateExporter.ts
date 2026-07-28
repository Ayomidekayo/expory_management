import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { createExporter } from "../../api/exporter.api";

import { queryKeys } from "../../lib/queryKeys";

export function useCreateExporter() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createExporter,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.exporters.all,
      });

      toast.success(
        "Exporter created successfully."
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to create exporter."
      );
    },
  });
}