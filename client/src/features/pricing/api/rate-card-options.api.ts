import axios from "axios";
import type {
  CreateRateCardOptionInput,
  RateCardOption,
  UpdateRateCardOptionInput,
} from "../types/rate-card-option.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export const rateCardOptionsApi = {
  async list(configurationId: string): Promise<RateCardOption[]> {
    const response = await client.get<ApiResponse<RateCardOption[]>>(
      `/configurations/${configurationId}/options`,
    );
    return response.data.data;
  },

  async getById(id: string): Promise<RateCardOption> {
    const response = await client.get<ApiResponse<RateCardOption>>(`/rate-card-options/${id}`);
    return response.data.data;
  },

  async create(configurationId: string, input: CreateRateCardOptionInput): Promise<RateCardOption> {
    const response = await client.post<ApiResponse<RateCardOption>>(
      `/configurations/${configurationId}/options`,
      input,
    );
    return response.data.data;
  },

  async update(id: string, input: UpdateRateCardOptionInput): Promise<RateCardOption> {
    const response = await client.patch<ApiResponse<RateCardOption>>(`/rate-card-options/${id}`, input);
    return response.data.data;
  },
};

export const {
  listRateCardOptions,
  getRateCardOption,
  createRateCardOption,
  updateRateCardOption,
} = {
  listRateCardOptions: rateCardOptionsApi.list,
  getRateCardOption: rateCardOptionsApi.getById,
  createRateCardOption: rateCardOptionsApi.create,
  updateRateCardOption: rateCardOptionsApi.update,
};
