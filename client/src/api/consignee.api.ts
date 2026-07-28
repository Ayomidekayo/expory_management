import axiosInstance from "../lib/axios";
import type { Consignee, ConsigneeQuery, CreateConsigneeDto, UpdateConsigneeDto } from "../types";


interface ConsigneeListResponse {
  success: boolean;
  data: Consignee[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ConsigneeResponse {
  success: boolean;

  data: Consignee;
}

export async function getConsignees(
  params?: ConsigneeQuery
) {
  const { data } =
    await axiosInstance.get<ConsigneeListResponse>(
      "/consignees",
      {
        params,
      }
    );

  return data;
}

export async function getConsignee(
  id: string
) {
  const { data } =
    await axiosInstance.get<ConsigneeResponse>(
      `/consignees/${id}`
    );

  return data;
}

export async function createConsignee(
  payload: CreateConsigneeDto
) {
  const { data } =
    await axiosInstance.post<ConsigneeResponse>(
      "/consignees",
      payload
    );

  return data;
}

export async function updateConsignee({
  id,
  payload,
}: {
  id: string;

  payload: UpdateConsigneeDto;
}) {
  const { data } =
    await axiosInstance.patch<ConsigneeResponse>(
      `/consignees/${id}`,
      payload
    );

  return data;
}

export async function deleteConsignee(
  id: string
) {
  const { data } =
    await axiosInstance.delete(
      `/consignees/${id}`
    );

  return data;
}