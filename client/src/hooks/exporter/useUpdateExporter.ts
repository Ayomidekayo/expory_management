import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { updateExporter } from "../../api/exporter.api";

import { queryKeys } from "../../lib/queryKeys";

import type {
  UpdateExporterDto,
} from "../../types/exporter.types";

interface Payload {
  id: string;

  payload: UpdateExporterDto;
}

export function useUpdateExporter() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: updateExporter,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.exporters.all,
      });

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.exporters.detail(
            variables.id
          ),
      });

      toast.success(
        "Exporter updated successfully."
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to update exporter."
      );
    },
  });
}