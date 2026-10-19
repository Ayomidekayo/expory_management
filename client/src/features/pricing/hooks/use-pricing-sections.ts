import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { pricingSectionsApi } from "../api/pricing-sections.api";
import type {
  CreatePricingSectionInput,
  UpdatePricingSectionInput,
} from "../types/pricing-section.types";

export const pricingSectionKeys = {
  all: ["pricing-sections"] as const,
  byConfiguration: (configurationId: string) =>
    [...pricingSectionKeys.all, "configuration", configurationId] as const,
  detail: (sectionId: string) =>
    [...pricingSectionKeys.all, "detail", sectionId] as const,
};

export function usePricingSections(configurationId: string, activeOnly = false) {
  return useQuery({
    queryKey: [...pricingSectionKeys.byConfiguration(configurationId), activeOnly],
    queryFn: () => pricingSectionsApi.list(configurationId, activeOnly),
    enabled: Boolean(configurationId),
  });
}

export function usePricingSection(sectionId: string) {
  return useQuery({
    queryKey: pricingSectionKeys.detail(sectionId),
    queryFn: () => pricingSectionsApi.getById(sectionId),
    enabled: Boolean(sectionId),
  });
}

export function useCreatePricingSection(configurationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePricingSectionInput) =>
      pricingSectionsApi.create(configurationId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: pricingSectionKeys.byConfiguration(configurationId),
      }),
  });
}

export function useUpdatePricingSection(
  sectionId: string,
  configurationId: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePricingSectionInput) =>
      pricingSectionsApi.update(sectionId, input),
    onSuccess: (section) => {
      queryClient.invalidateQueries({
        queryKey: pricingSectionKeys.byConfiguration(configurationId),
      });
      queryClient.setQueryData(pricingSectionKeys.detail(sectionId), section);
    },
  });
}
