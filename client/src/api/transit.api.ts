import axiosInstance from "../lib/axios";

import type { CreateTransitDto, Transit, TransitQuery, UpdateTransitDto } from "../types/transit.type";

/* ===========================================
   RESPONSES
=========================================== */

interface TransitListResponse {
  success: boolean;

  data: Transit[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TransitResponse {
  success: boolean;

  data: Transit;
}

/* ===========================================
   GET ALL
=========================================== */

export async function getTransits(
  params?: TransitQuery
) {
  const { data } =
    await axiosInstance.get<TransitListResponse>(
      "/transits",
      {
        params,
      }
    );

  return data;
}

/* ===========================================
   GET ONE
=========================================== */

export async function getTransit(
  id: string
) {
  const { data } =
    await axiosInstance.get<TransitResponse>(
      `/transits/${id}`
    );

  return data;
}

/* ===========================================
   CREATE
=========================================== */

export async function createTransit(
  payload: CreateTransitDto
) {
  const { data } =
    await axiosInstance.post<TransitResponse>(
      "/transits",
      payload
    );

  return data;
}

/* ===========================================
   UPDATE
=========================================== */

export async function updateTransit({
  id,
  payload,
}: {
  id: string;

  payload: UpdateTransitDto;
}) {
  const { data } =
    await axiosInstance.patch<TransitResponse>(
      `/transits/${id}`,
      payload
    );

  return data;
}

/* ===========================================
   DELETE
=========================================== */

export async function deleteTransit(
  id: string
) {
  const { data } =
    await axiosInstance.delete(
      `/transits/${id}`
    );

  return data;
}