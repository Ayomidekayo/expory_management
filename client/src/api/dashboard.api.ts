import api from "../lib/axios";
import type { DashboardData } from "../types/dashboard.types";



interface DashboardResponse {
  success: boolean;

  data: DashboardData;
}

export async function getDashboard() {
  const { data } =
    await api.get<DashboardResponse>(
      "/dashboard"
    );

  return data.data;
}