
import api from "../../../lib/axios";

export interface RateCardAirline {
  id: string;
  configurationId: string;
  code: string;
  name: string;
  ratePerKg: number | string;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRateCardAirlineInput {
  configurationId: string;
  code: string;
  name: string;
  ratePerKg: number;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateRateCardAirlineInput {
  code?: string;
  name?: string;
  ratePerKg?: number;
  displayOrder?: number;
  isActive?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const unwrap = <T,>(response: { data: ApiResponse<T> }): T => {
  return response.data.data;
};

export async function getRateCardAirlines(
  rateCardId: string,
  configurationId: string,
  activeOnly = false,
): Promise<RateCardAirline[]> {
  const response = await api.get<ApiResponse<RateCardAirline[]>>(
    `/rate-cards/${rateCardId}/airlines`,
    {
      params: {
        configurationId,
        activeOnly,
      },
    },
  );

  return unwrap(response);
}

export async function createRateCardAirline(
  rateCardId: string,
  input: CreateRateCardAirlineInput,
): Promise<RateCardAirline> {
  const response = await api.post<ApiResponse<RateCardAirline>>(
    `/rate-cards/${rateCardId}/airlines`,
    input,
  );

  return unwrap(response);
}

export async function updateRateCardAirline(
  rateCardId: string,
  airlineId: string,
  input: UpdateRateCardAirlineInput,
): Promise<RateCardAirline> {
  const response = await api.patch<ApiResponse<RateCardAirline>>(
    `/rate-cards/${rateCardId}/airlines/${airlineId}`,
    input,
  );

  return unwrap(response);
}
