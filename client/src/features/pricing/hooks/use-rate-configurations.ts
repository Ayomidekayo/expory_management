import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createRateCardConfiguration,
  getRateCardConfiguration,
  listRateCardConfigurations,
  rateCardConfigurationApi,
  updateRateCardConfiguration,
} from "../api/rate-card-configuration.api";

import type {
  CreateRateConfigurationInput,
  UpdateRateConfigurationInput,
} from "../types/pricing.types";

export const rateCardConfigurationKeys = {
  all: ["rate-card-configurations"] as const,

  lists: (rateCardId: string) =>
    [...rateCardConfigurationKeys.all, "list", rateCardId] as const,

  details: () =>
    [...rateCardConfigurationKeys.all, "detail"] as const,

  detail: (configurationId: string) =>
    [...rateCardConfigurationKeys.details(), configurationId] as const,
};

export function useRateCardConfigurations(rateCardId: string) {
  return useQuery({
    queryKey: rateCardConfigurationKeys.lists(rateCardId),
    queryFn: () => listRateCardConfigurations(rateCardId),
    enabled: Boolean(rateCardId),
  });
}

export function useRateCardConfiguration(
  rateCardId: string,
  configurationId: string,
) {
  return useQuery({
    queryKey: [
      "rate-card-configuration",
      rateCardId,
      configurationId,
    ],
    queryFn: () =>
      rateCardConfigurationApi.getById(configurationId),
    enabled: Boolean(rateCardId && configurationId),
  });
}

export function useCreateRateCardConfiguration(rateCardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRateConfigurationInput) =>
      createRateCardConfiguration(rateCardId, input),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: rateCardConfigurationKeys.lists(rateCardId),
        }),
        queryClient.invalidateQueries({
          queryKey: ["quotation-rate-cards"],
        }),
      ]);
    },
  });
}

export function useUpdateRateCardConfiguration(
  configurationId: string,
  rateCardId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateRateConfigurationInput) =>
      updateRateCardConfiguration(configurationId, input),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: rateCardConfigurationKeys.detail(configurationId),
        }),
        queryClient.invalidateQueries({
          queryKey: rateCardConfigurationKeys.lists(rateCardId),
        }),
        queryClient.invalidateQueries({
          queryKey: ["quotation-rate-cards"],
        }),
      ]);
    },
  });
}