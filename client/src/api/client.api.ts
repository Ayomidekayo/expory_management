import axiosInstance from "../lib/axios";
import type {
  Client,
  ClientQuery,
  CreateClientDto,
  UpdateClientDto,
} from "../types/client.types";

interface ClientListResponse {
  success: boolean;
  data: Client[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ClientResponse {
  success: boolean;
  data: Client;
}

export async function getClients(
  params?: ClientQuery
) {
  const { data } =
    await axiosInstance.get<ClientListResponse>(
      "/clients",
      {
        params,
      }
    );

  return data;
}

export async function getClient(id: string) {
  const { data } =
    await axiosInstance.get<ClientResponse>(
      `/clients/${id}`
    );

  return data;
}

export async function createClient(
  payload: CreateClientDto
) {
  const { data } =
    await axiosInstance.post<ClientResponse>(
      "/clients",
      payload
    );

  return data;
}

export async function updateClient({
  id,
  payload,
}: {
  id: string;
  payload: UpdateClientDto;
  
}) {
   console.log(id);
  console.log(payload);
  const { data } =
    await axiosInstance.patch<ClientResponse>(
      `/clients/${id}`,
      payload
    );

  return data;
}

export async function deleteClient(
  id: string
) {
  const { data } =
    await axiosInstance.delete(
      `/clients/${id}`
    );

  return data;
}

export async function updateClientStatus(
  id: string,
  isActive: boolean
) {
  const { data } =
    await axiosInstance.patch(
      `/clients/${id}/status`,
      {
        isActive,
      }
    );

  return data;
}