import { useMutation, useQuery } from "@tanstack/react-query";
import { publicQuotationApi } from "../api/public-quotation.api";
import type { QuoteDirection, QuoteMode } from "../types/public-quotation.types";

export const publicQuotationKeys = {
  rateCards: (mode: QuoteMode, direction: QuoteDirection) => ["public-quotation", "rate-cards", mode, direction] as const,
  configurations: (rateCardId: string) => ["public-quotation", "configurations", rateCardId] as const,
};

export function usePublicRateCards(mode: QuoteMode, direction: QuoteDirection) {
  return useQuery({ queryKey: publicQuotationKeys.rateCards(mode, direction), queryFn: () => publicQuotationApi.listRateCards(mode, direction) });
}

export function usePublicConfigurations(rateCardId: string) {
  return useQuery({
    queryKey: publicQuotationKeys.configurations(rateCardId),
    queryFn: () => publicQuotationApi.getConfigurations(rateCardId),
    enabled: Boolean(rateCardId),
  });
}

export function useCalculatePublicQuote() {
  return useMutation({ mutationFn: publicQuotationApi.calculate });
}
