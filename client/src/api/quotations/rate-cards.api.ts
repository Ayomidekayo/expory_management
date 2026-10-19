import api from "../../lib/api";

export interface RateCardFilters {
  mode?: "AIR" | "LAND" | "SEA";
  direction?: "IMPORT" | "EXPORT";
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
}

export interface CreateRateCardInput {
  name: string;
  mode: "AIR" | "LAND" | "SEA";
  direction: "IMPORT" | "EXPORT";
  currency?: string;
  effectiveFrom?: string;
  effectiveTo?: string | null;
}

export const getRateCards = async (
  filters: RateCardFilters = {},
) => {
  const { data } = await api.get("/rate-cards", {
    params: filters,
  });

  return data;
};

export const getRateCard = async (id: string) => {
  const { data } = await api.get(`/rate-cards/${id}`);

  return data;
};

export const createRateCard = async (
  input: CreateRateCardInput,
) => {
  const { data } = await api.post("/rate-cards", input);

  return data;
};

export const updateRateCard = async (
  id: string,
  input: Partial<CreateRateCardInput>,
) => {
  const { data } = await api.patch(
    `/rate-cards/${id}`,
    input,
  );

  return data;
};

export const activateRateCard = async (id: string) => {
  const { data } = await api.post(
    `/rate-cards/${id}/activate`,
  );

  return data;
};