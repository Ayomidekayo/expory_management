import { useQuery } from "@tanstack/react-query";

import { rateCardEditorApi } from "../api/rate-card-editor.api";

export function useRateCardEditor(rateCardId: string) {
  return useQuery({
    queryKey: ["rate-card-editor", rateCardId],
    queryFn: () => rateCardEditorApi.getRateCard(rateCardId),
    enabled: Boolean(rateCardId),
  });
}