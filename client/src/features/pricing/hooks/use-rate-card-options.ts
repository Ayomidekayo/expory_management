import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rateCardOptionsApi } from "../api/rate-card-options.api";
import type {
  CreateRateCardOptionInput,
  UpdateRateCardOptionInput,
} from "../types/rate-card-option.types";

export const rateCardOptionKeys = {
  all: ["rate-card-options"] as const,
  lists: (configurationId: string) =>
    [...rateCardOptionKeys.all, "list", configurationId] as const,
  details: () => [...rateCardOptionKeys.all, "detail"] as const,
  detail: (id: string) => [...rateCardOptionKeys.details(), id] as const,
};

export function useRateCardOptions(configurationId: string) {
  return useQuery({
    queryKey: rateCardOptionKeys.lists(configurationId),
    queryFn: () => rateCardOptionsApi.list(configurationId),
    enabled: Boolean(configurationId),
  });
}

export function useRateCardOption(id: string) {
  return useQuery({
    queryKey: rateCardOptionKeys.detail(id),
    queryFn: () => rateCardOptionsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateRateCardOption(configurationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRateCardOptionInput) =>
      rateCardOptionsApi.create(configurationId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: rateCardOptionKeys.lists(configurationId),
      });
      await queryClient.invalidateQueries({
        queryKey: ["rate-card-configurations"],
      });
    },
  });
}

export function useUpdateRateCardOption(id: string, configurationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateRateCardOptionInput) =>
      rateCardOptionsApi.update(id, input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: rateCardOptionKeys.detail(id) }),
        queryClient.invalidateQueries({
          queryKey: rateCardOptionKeys.lists(configurationId),
        }),
        queryClient.invalidateQueries({
          queryKey: ["rate-card-configurations"],
        }),
      ]);
    },
  });
}
