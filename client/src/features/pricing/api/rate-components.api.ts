import axios from "axios";
import type { RateComponent, RateComponentInput } from "../types/rate-component.types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const unwrap = <T,>(response: { data: { data: T } }) => response.data.data;
export const rateComponentsApi = {
 async list(
  rateCardId: string,
  filters: {
    configurationId?: string;
    pricingSectionId?: string;
    optionId?: string;
  } = {},
) {
  return unwrap<RateComponent[]>(
    await api.get(`/rate-cards/${rateCardId}/components`, {
      params: filters,
    }),
  );
},
  async create(rateCardId: string, input: RateComponentInput) {
    return unwrap<RateComponent>(await api.post(`/rate-cards/${rateCardId}/components`, input));
  },
  async update(componentId: string, input: Partial<RateComponentInput>) {
    return unwrap<RateComponent>(await api.patch(`/components/${componentId}`, input));
  },
  
async remove(componentId: string) {
  const response = await api.delete(
    `/components/${componentId}`,
  );

  return response.data.data;
},

};
