import axios from "axios";

import type {
  CreatePricingSectionInput,
  PricingSection,
  UpdatePricingSectionInput,
} from "../types/pricing-section.types";

const API_BASE_URL =

  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export const pricingSectionsApi = {
  async list(
    configurationId: string,
    activeOnly = false,
  ): Promise<PricingSection[]> {
    const response = await client.get<ApiResponse<PricingSection[]>>(
      `/configurations/${configurationId}/pricing-sections`,
      {
        params: { activeOnly: String(activeOnly) },
      },
    );

    return response.data.data;
  },

  async getById(sectionId: string): Promise<PricingSection> {
    const response = await client.get<ApiResponse<PricingSection>>(
      `/pricing-sections/${sectionId}`,
    );

    return response.data.data;
  },

  async create(
    configurationId: string,
    input: CreatePricingSectionInput,
  ): Promise<PricingSection> {
    const response = await client.post<ApiResponse<PricingSection>>(
      `/configurations/${configurationId}/pricing-sections`,
      input,
    );

    return response.data.data;
  },

  async update(
    sectionId: string,
    input: UpdatePricingSectionInput,
  ): Promise<PricingSection> {
    const response = await client.patch<ApiResponse<PricingSection>>(
      `/pricing-sections/${sectionId}`,
      input,
    );

    return response.data.data;
  },
};

export const {
  listPricingSections,
  getPricingSection,
  createPricingSection,
  updatePricingSection,
} = {
  listPricingSections: pricingSectionsApi.list,
  getPricingSection: pricingSectionsApi.getById,
  createPricingSection: pricingSectionsApi.create,
  updatePricingSection: pricingSectionsApi.update,
};