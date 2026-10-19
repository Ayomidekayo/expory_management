
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { rateComponentsApi } from "../api/rate-components.api";
import type {
  CreateRateComponentPayload,
  RateComponentInput,
} from "../types/rate-component.types";

export const rateComponentKeys = {
  all: ["rate-components"] as const,

  byRateCard: (rateCardId: string) =>
    [...rateComponentKeys.all, rateCardId] as const,
};

export function useRateComponents(
  rateCardId: string,
  configurationId?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: [
      ...rateComponentKeys.byRateCard(rateCardId),
      configurationId,
    ],
    queryFn: () =>
      rateComponentsApi.list(rateCardId, {
        configurationId,
      }),
    enabled: Boolean(rateCardId) && enabled,
  });
}

export function useCreateRateComponent(rateCardId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRateComponentPayload) =>
      rateComponentsApi.create(rateCardId, input),

    onSuccess: () =>
      client.invalidateQueries({
        queryKey: rateComponentKeys.byRateCard(rateCardId),
      }),
  });
}

export function useUpdateRateComponent(rateCardId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<RateComponentInput>;
    }) => rateComponentsApi.update(id, input),

    onSuccess: () =>
      client.invalidateQueries({
        queryKey: rateComponentKeys.byRateCard(rateCardId),
      }),
  });
}

export function useDeleteRateComponent(rateCardId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (componentId: string) =>
      rateComponentsApi.remove(componentId),

    onSuccess: () =>
      client.invalidateQueries({
        queryKey: rateComponentKeys.byRateCard(rateCardId),
      }),
  });
}
