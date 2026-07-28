import axiosInstance from "../lib/axios";
import type { Container, ContainerQuery, CreateContainerDto, UpdateContainerDto } from "../types/container.type";


/* ===========================================
   RESPONSES
=========================================== */

interface ContainerListResponse {
  success: boolean;

  data: Container[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ContainerResponse {
  success: boolean;

  data: Container;
}

/* ===========================================
   GET ALL
=========================================== */

export async function getContainers(
  params?: ContainerQuery
) {
  const { data } =
    await axiosInstance.get<ContainerListResponse>(
      "/containers",
      {
        params,
      }
    );

  return data;
}

/* ===========================================
   GET ONE
=========================================== */

export async function getContainer(
  id: string
) {
  const { data } =
    await axiosInstance.get<ContainerResponse>(
      `/containers/${id}`
    );

  return data;
}

/* ===========================================
   CREATE
=========================================== */

export async function createContainer(
  payload: CreateContainerDto
) {
  const { data } =
    await axiosInstance.post<ContainerResponse>(
      "/containers",
      payload
    );

  return data;
}

/* ===========================================
   UPDATE
=========================================== */

export async function updateContainer({
  id,
  payload,
}: {
  id: string;

  payload: UpdateContainerDto;
}) {
  const { data } =
    await axiosInstance.patch<ContainerResponse>(
      `/containers/${id}`,
      payload
    );

  return data;
}

/* ===========================================
   DELETE
=========================================== */

export async function deleteContainer(
  id: string
) {
  const { data } =
    await axiosInstance.delete(
      `/containers/${id}`
    );

  return data;
}