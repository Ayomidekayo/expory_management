import axios from "axios";
import type {
  SlabRatesInput,
  WeightSlab,
  WeightSlabFilters,
  WeightSlabInput,
} from "../types/weight-slab.types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const unwrap = <T,>(response: { data: { data: T } }): T => response.data.data;

export const weightSlabsApi = {
  async list(rateCardId: string, filters: WeightSlabFilters = {}) {
    const response = await api.get(`/rate-cards/${rateCardId}/weight-slabs`, { params: filters });
    return unwrap<WeightSlab[]>(response);
  },
  async getById(weightSlabId: string) {
    const response = await api.get(`/weight-slabs/${weightSlabId}`);
    return unwrap<WeightSlab>(response);
  },
  async create(rateCardId: string, input: WeightSlabInput) {
    const response = await api.post(`/rate-cards/${rateCardId}/weight-slabs`, input);
    return unwrap<WeightSlab>(response);
  },
  async update(weightSlabId: string, input: Partial<WeightSlabInput>) {
    const response = await api.patch(`/weight-slabs/${weightSlabId}`, input);
    return unwrap<WeightSlab>(response);
  },
  async remove(weightSlabId: string) {
    const response = await api.delete(`/weight-slabs/${weightSlabId}`);
    return unwrap<WeightSlab>(response);
  },
  async setRates(weightSlabId: string, input: SlabRatesInput) {
    const response = await api.put(`/weight-slabs/${weightSlabId}/rates`, input);
    return unwrap<WeightSlab>(response);
  },
};
