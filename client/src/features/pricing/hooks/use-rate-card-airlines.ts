
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createRateCardAirline, getRateCardAirlines, updateRateCardAirline, type CreateRateCardAirlineInput, type UpdateRateCardAirlineInput } from "../api/rate-card-airline.api";



const airlineKeys = {
  all: ["rate-card-airlines"] as const,
  list: (
    rateCardId: string,
    configurationId: string,
    activeOnly: boolean,
  ) =>
    [
      ...airlineKeys.all,
      rateCardId,
      configurationId,
      activeOnly,
    ] as const,
};

export function useRateCardAirlines(
  rateCardId: string,
  configurationId: string,
  activeOnly = false,
) {
  return useQuery({
    queryKey: airlineKeys.list(
      rateCardId,
      configurationId,
      activeOnly,
    ),
    queryFn: () =>
      getRateCardAirlines(
        rateCardId,
        configurationId,
        activeOnly,
      ),
    enabled: Boolean(rateCardId && configurationId),
  });
}

export function useCreateRateCardAirline(rateCardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRateCardAirlineInput) =>
      createRateCardAirline(rateCardId, input),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: airlineKeys.all,
      });
    },
  });
}

export function useUpdateRateCardAirline(
  rateCardId: string,
  _configurationId: string,
  airlineId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateRateCardAirlineInput) => {
      if (!airlineId) {
        throw new Error("Select an airline before updating it.");
      }

      return updateRateCardAirline(
        rateCardId,
        airlineId,
        input,
      );
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: airlineKeys.all,
      });
    },
  });
}
