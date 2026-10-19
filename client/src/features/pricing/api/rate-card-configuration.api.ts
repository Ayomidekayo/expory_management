import axios from "axios";

import type {
  ApiResponse,
  RateCardConfiguration,
  CreateRateConfigurationInput,
  UpdateRateConfigurationInput,
} from "../types/pricing.types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Use the same token key as your existing auth.store.ts.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const rateCardConfigurationApi = {
  async list(
    rateCardId: string,
  ): Promise<RateCardConfiguration[]> {
    const response = await api.get<
      ApiResponse<RateCardConfiguration[]>
    >(`/rate-cards/${rateCardId}/configurations`);

    return response.data.data;
  },

  async getById(
    configurationId: string,
  ): Promise<RateCardConfiguration> {
    const response = await api.get<
      ApiResponse<RateCardConfiguration>
    >(`/configurations/${configurationId}`);

    return response.data.data;
  },

  async create(
    rateCardId: string,
    input: CreateRateConfigurationInput,
  ): Promise<RateCardConfiguration> {
    const response = await api.post<
      ApiResponse<RateCardConfiguration>
    >(`/rate-cards/${rateCardId}/configurations`, input);

    return response.data.data;
  },

  async update(
    configurationId: string,
    input: UpdateRateConfigurationInput,
  ): Promise<RateCardConfiguration> {
    const response = await api.patch<
      ApiResponse<RateCardConfiguration>
    >(`/configurations/${configurationId}`, input);

    return response.data.data;
  },
};

export const listRateCardConfigurations =
  rateCardConfigurationApi.list;

export const getRateCardConfiguration =
  rateCardConfigurationApi.getById;

export const createRateCardConfiguration =
  rateCardConfigurationApi.create;

export const updateRateCardConfiguration =
  rateCardConfigurationApi.update;