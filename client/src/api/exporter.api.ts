import axiosInstance from "../lib/axios";
import type { ExporterQuery } from "../types";

import type {
  Exporter,
  CreateExporterDto,
  UpdateExporterDto,
} from "../types/exporter.types";

interface ExporterListResponse {
  success: boolean;

  data: Exporter[];
}

interface ExporterResponse {
  success: boolean;

  data: Exporter;
}

export async function getExporters(
  params?: ExporterQuery
) {
  const { data } =
    await axiosInstance.get<ExporterListResponse>(
      "/exporters",
      {
        params,
      }
    );

  return data;
}

export async function getExporter(id: string) {
  const { data } =
    await axiosInstance.get<ExporterResponse>(
      `/exporters/${id}`
    );

  return data;
}

export async function createExporter(
  payload: CreateExporterDto
) {
  const { data } =
    await axiosInstance.post<ExporterResponse>(
      "/exporters",
      payload
    );

  return data;
}

export async function updateExporter({
  id,
  payload,
}: {
  id: string;
  payload: UpdateExporterDto;
}) {
  const { data } =
    await axiosInstance.patch<ExporterResponse>(
      `/exporters/${id}`,
      payload
    );

  return data;
}

export async function deleteExporter(
  id: string
) {
  const { data } =
    await axiosInstance.delete(
      `/exporters/${id}`
    );

  return data;
}