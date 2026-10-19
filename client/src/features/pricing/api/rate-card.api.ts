import axios from "axios";

import type {
  ApiResponse,
  RateCard,
  CreateRateCardInput,
  UpdateRateCardInput,
} from "../types/pricing.types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the authentication token saved by auth.store.ts.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export const rateCardApi = {
  async getAll(): Promise<RateCard[]> {
    const response = await api.get<ApiResponse<RateCard[]>>(
      "/rate-cards",
    );

    return response.data.data;
  },

  async getById(id: string): Promise<RateCard> {
    const response = await api.get<ApiResponse<RateCard>>(
      `/rate-cards/${id}`,
    );

    return response.data.data;
  },

  async create(input: CreateRateCardInput): Promise<RateCard> {
    const response = await api.post<ApiResponse<RateCard>>(
      "/rate-cards",
      input,
    );

    return response.data.data;
  },

  async update(
    id: string,
    input: UpdateRateCardInput,
  ): Promise<RateCard> {
    const response = await api.patch<ApiResponse<RateCard>>(
      `/rate-cards/${id}`,
      input,
    );

    return response.data.data;
  },

  async activate(id: string): Promise<RateCard> {
    const response = await api.patch<ApiResponse<RateCard>>(
      `/rate-cards/${id}/activate`,
    );

    return response.data.data;
  },
};