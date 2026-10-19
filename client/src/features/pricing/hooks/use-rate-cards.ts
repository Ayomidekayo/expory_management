import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { rateCardApi } from "../api/rate-card.api";

import type {
  CreateRateCardInput,
  UpdateRateCardInput,
} from "../types/pricing.types";

export const rateCardKeys = {
  all: ["pricing", "rate-cards"] as const,

  lists: () => [...rateCardKeys.all, "list"] as const,

  details: () => [...rateCardKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...rateCardKeys.details(), id] as const,
};

/**
 * Fetch all rate cards.
 */
export function useRateCards() {
  return useQuery({
    queryKey: rateCardKeys.lists(),
    queryFn: rateCardApi.getAll,
  });
}

/**
 * Fetch one rate card.
 */
export function useRateCard(id: string) {
  return useQuery({
    queryKey: rateCardKeys.detail(id),
    queryFn: () => rateCardApi.getById(id),
    enabled: Boolean(id),
  });
}

/**
 * Create a rate card.
 */
export function useCreateRateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRateCardInput) =>
      rateCardApi.create(input),

    onSuccess: (createdRateCard) => {
      queryClient.invalidateQueries({
        queryKey: rateCardKeys.lists(),
      });

      queryClient.setQueryData(
        rateCardKeys.detail(createdRateCard.id),
        createdRateCard,
      );
    },
  });
}

/**
 * Update a rate card.
 */
export function useUpdateRateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateRateCardInput;
    }) => rateCardApi.update(id, input),

    onSuccess: (updatedRateCard) => {
      queryClient.invalidateQueries({
        queryKey: rateCardKeys.lists(),
      });

      queryClient.setQueryData(
        rateCardKeys.detail(updatedRateCard.id),
        updatedRateCard,
      );
    },
  });
}

/**
 * Activate a rate card.
 */
export function useActivateRateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rateCardApi.activate(id),

    onSuccess: (activatedRateCard) => {
      queryClient.invalidateQueries({
        queryKey: rateCardKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: rateCardKeys.detail(activatedRateCard.id),
      });
    },
  });
}