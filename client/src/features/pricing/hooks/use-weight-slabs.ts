import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { weightSlabsApi } from "../api/weight-slabs.api";
import type { SlabRatesInput, WeightSlabFilters, WeightSlabInput } from "../types/weight-slab.types";

export const weightSlabKeys = {
  all: ["weight-slabs"] as const,
  lists: () => [...weightSlabKeys.all, "list"] as const,
  list: (rateCardId: string, filters: WeightSlabFilters = {}) => [
    ...weightSlabKeys.lists(), rateCardId,
    filters.configurationId ?? null,
    filters.optionId ?? null,
    filters.pricingSectionId ?? null,
  ] as const,
  detail: (weightSlabId: string) => [...weightSlabKeys.all, "detail", weightSlabId] as const,
};

export function useWeightSlabs(rateCardId: string, filters: WeightSlabFilters = {}, enabled = true) {
  return useQuery({
    queryKey: weightSlabKeys.list(rateCardId, filters),
    queryFn: () => weightSlabsApi.list(rateCardId, filters),
    enabled: Boolean(rateCardId) && enabled,
  });
}

export function useWeightSlab(weightSlabId: string) {
  return useQuery({
    queryKey: weightSlabKeys.detail(weightSlabId),
    queryFn: () => weightSlabsApi.getById(weightSlabId),
    enabled: Boolean(weightSlabId),
  });
}

export function useCreateWeightSlab(rateCardId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: WeightSlabInput) => weightSlabsApi.create(rateCardId, input),
    onSuccess: async () => client.invalidateQueries({ queryKey: weightSlabKeys.lists() }),
  });
}

export function useUpdateWeightSlab(_rateCardId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<WeightSlabInput> }) => weightSlabsApi.update(id, input),
    onSuccess: async (slab) => Promise.all([
      client.invalidateQueries({ queryKey: weightSlabKeys.lists() }),
      client.invalidateQueries({ queryKey: weightSlabKeys.detail(slab.id) }),
    ]),
  });
}

export function useDeleteWeightSlab(_rateCardId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (weightSlabId: string) => weightSlabsApi.remove(weightSlabId),
    onSuccess: async (_, weightSlabId) => Promise.all([
      client.invalidateQueries({ queryKey: weightSlabKeys.lists() }),
      client.removeQueries({ queryKey: weightSlabKeys.detail(weightSlabId) }),
    ]),
  });
}

export function useSetWeightSlabRates(_rateCardId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ weightSlabId, input }: { weightSlabId: string; input: SlabRatesInput }) => weightSlabsApi.setRates(weightSlabId, input),
    onSuccess: async (slab) => Promise.all([
      client.invalidateQueries({ queryKey: weightSlabKeys.lists() }),
      client.invalidateQueries({ queryKey: weightSlabKeys.detail(slab.id) }),
    ]),
  });
}
