import axiosInstance from "../lib/axios";

import type {
  Shipment,
  ShipmentQuery,
  CreateShipmentDto,
  UpdateShipmentDto,
} from "../types/shipment.types";

interface ShipmentListResponse {
  success: boolean;

  data: Shipment[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ShipmentResponse {
  success: boolean;

  data: Shipment;
}

/* ===========================================
   GET AVAILABLE
=========================================== */

export async function getAvailableShipments(
  params?: ShipmentQuery
) {
  const { data } =
    await axiosInstance.get<ShipmentListResponse>(
      "/shipments/available",
      {
        params,
      }
    );

  return data;
}

/* ===========================================
   GET ALL
=========================================== */

export async function getShipments(
  params?: ShipmentQuery
) {
  const { data } =
    await axiosInstance.get<ShipmentListResponse>(
      "/shipments",
      {
        params,
      }
    );

  return data;
}

/* ===========================================
   GET ONE
=========================================== */

export async function getShipment(
  id: string
) {
  const { data } =
    await axiosInstance.get<ShipmentResponse>(
      `/shipments/${id}`
    );

  return data;
}

/* ===========================================
   CREATE
=========================================== */

export async function createShipment(
  payload: CreateShipmentDto
) {
  const { data } =
    await axiosInstance.post<ShipmentResponse>(
      "/shipments",
      payload
    );

  return data;
}

/* ===========================================
   UPDATE
=========================================== */

export async function updateShipment({
  id,
  payload,
}: {
  id: string;

  payload: UpdateShipmentDto;
}) {
  const { data } =
    await axiosInstance.patch<ShipmentResponse>(
      `/shipments/${id}`,
      payload
    );

  return data;
}

/* ===========================================
   DELETE
=========================================== */

export async function deleteShipment(
  id: string
) {
  const { data } =
    await axiosInstance.delete(
      `/shipments/${id}`
    );

  return data;
}