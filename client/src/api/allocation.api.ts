import axiosInstance from "../lib/axios";

import type {
  Allocation,
  AllocationQuery,
  CreateAllocationDto,
  UpdateAllocationDto,
} from "../types/allocation.types";

interface AllocationListResponse {
  success: boolean;

  data: Allocation[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface AllocationResponse {
  success: boolean;

  data: Allocation;
}

/* ===========================================
   GET ALL
=========================================== */

export async function getAllocations(
  params?: AllocationQuery
) {
  const { data } =
    await axiosInstance.get<AllocationListResponse>(
      "/allocations",
      {
        params,
      }
    );

  return data;
}

/* ===========================================
   GET ONE
=========================================== */

export async function getAllocation(
  id: string
) {
  const { data } =
    await axiosInstance.get<AllocationResponse>(
      `/allocations/${id}`
    );

  return data;
}

/* ===========================================
   CREATE
=========================================== */

export async function createAllocation(
  payload: CreateAllocationDto
) {
  const { data } =
    await axiosInstance.post<AllocationResponse>(
      "/allocations",
      payload
    );

  return data;
}

/* ===========================================
   UPDATE
=========================================== */

export async function updateAllocation({
  id,
  payload,
}: {
  id: string;

  payload: UpdateAllocationDto;
}) {
  const { data } =
    await axiosInstance.patch<AllocationResponse>(
      `/allocations/${id}`,
      payload
    );

  return data;
}

/* ===========================================
   DELETE
=========================================== */

export async function deleteAllocation(
  id: string
) {
  const { data } =
    await axiosInstance.delete(
      `/allocations/${id}`
    );

  return data;
}

/* ===========================================
   STATUS
=========================================== */

export async function updateAllocationStatus(
  id: string,
  status: string
) {
  const { data } =
    await axiosInstance.patch(
      `/allocations/${id}/status`,
      {
        status,
      }
    );

  return data;
}