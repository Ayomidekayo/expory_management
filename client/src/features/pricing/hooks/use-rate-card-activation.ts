import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  activateRateCard,
  archiveRateCard,
  validateRateCard,
} from "../api/rate-card-activation.api";

export function useValidateRateCard(rateCardId: string) {
  return useMutation({ mutationFn: () => validateRateCard(rateCardId) });
}

export function useActivateRateCard(rateCardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => activateRateCard(rateCardId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["rate-cards"] }),
        queryClient.invalidateQueries({ queryKey: ["rate-card", rateCardId] }),
        queryClient.invalidateQueries({ queryKey: ["rate-card-configurations", rateCardId] }),
      ]);
    },
  });
}

export function useArchiveRateCard(rateCardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => archiveRateCard(rateCardId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["rate-cards"] }),
        queryClient.invalidateQueries({ queryKey: ["rate-card", rateCardId] }),
      ]);
    },
  });
}
