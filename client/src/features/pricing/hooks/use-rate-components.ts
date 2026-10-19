import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rateComponentsApi } from "../api/rate-components.api";
import type { RateComponentInput } from "../types/rate-component.types";

export const rateComponentKeys = {
  all: ["rate-components"] as const,
  byRateCard: (rateCardId: string) => [...rateComponentKeys.all, rateCardId] as const,
};
export function useRateComponents(rateCardId: string, enabled = true) {
  return useQuery({ queryKey: rateComponentKeys.byRateCard(rateCardId), queryFn: () => rateComponentsApi.list(rateCardId), enabled: Boolean(rateCardId) && enabled });
}
export function useCreateRateComponent(rateCardId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: (input: RateComponentInput) => rateComponentsApi.create(rateCardId, input), onSuccess: () => client.invalidateQueries({ queryKey: rateComponentKeys.byRateCard(rateCardId) }) });
}
export function useUpdateRateComponent(rateCardId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, input }: { id: string; input: Partial<RateComponentInput> }) => rateComponentsApi.update(id, input), onSuccess: () => client.invalidateQueries({ queryKey: rateComponentKeys.byRateCard(rateCardId) }) });
}
