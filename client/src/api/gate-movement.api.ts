import axiosInstance from "../lib/axios";

/* =========================================
   TYPES
========================================= */

export type GateType =
  | "TERMINAL_GATE"
  | "ECOWAS_GATE";

export type GateMovementStatus =
  | "PENDING"
  | "CLEARED"
  | "CROSSED"
  | "CANCELLED";

/* =========================================
   RELATED CONTAINER
========================================= */

export interface GateContainer {
  id: string;
  containerNumber: string;

  sealNumber?: string | null;

  containerType?: string;
  containerSize?: string;

  status?: string;

  shippingLine?: string | null;

  bookingReference?: string | null;

  shipment?: {
    id: string;
    shipmentNumber: string;

    client?: {
      companyName?: string | null;
    } | null;

    exporter?: {
      companyName?: string | null;
    } | null;

    consignee?: {
      companyName?: string | null;
    } | null;
  } | null;
}

/* =========================================
   GATE MOVEMENT
========================================= */

export interface GateMovement {
  id: string;

  containerId?: string | null;

  containerNumber: string;

  yardStoreNumber?: string | null;

  truckFrontPlate: string;

  truckBackPlate: string;

  gateType: GateType;

  status: GateMovementStatus;

  clearedAt?: string | null;

  crossedAt?: string | null;

  notes?: string | null;

  createdAt: string;

  updatedAt: string;

  container?: GateContainer | null;
}

/* =========================================
   CREATE
========================================= */

export interface CreateGateMovementDto {
  containerId?: string;

  containerNumber: string;

  yardStoreNumber?: string;

  truckFrontPlate: string;

  truckBackPlate: string;

  gateType: GateType;

  status?: GateMovementStatus;

  notes?: string;
}

/* =========================================
   UPDATE
========================================= */

export interface UpdateGateMovementDto {
  containerId?: string;

  containerNumber: string;

  yardStoreNumber?: string;

  truckFrontPlate: string;

  truckBackPlate: string;

  gateType: GateType;

  status: GateMovementStatus;

  notes?: string;
}

/* =========================================
   FILTERS
========================================= */

export interface GateMovementFilters {
  gateType?: GateType;

  status?: GateMovementStatus;

  containerNumber?: string;

  yardStoreNumber?: string;
}

/* =========================================
   STATISTICS
========================================= */

export interface GateStatistics {
  total: number;

  pending: number;

  cleared: number;

  crossed: number;

  cancelled: number;

  terminalGate: number;

  ecowasGate: number;
}

/* =========================================
   RESPONSES
========================================= */

interface GateMovementResponse {
  success: boolean;

  data: GateMovement;
}

interface GateMovementListResponse {
  success: boolean;

  data: GateMovement[];
}

interface GateStatisticsResponse {
  success: boolean;

  data: GateStatistics;
}

/* =========================================
   GET ALL
========================================= */

export async function getGateMovements(
  params?: GateMovementFilters
) {
  const { data } =
    await axiosInstance.get<GateMovementListResponse>(
      "/gate-movements",
      {
        params,
      }
    );

  return data;
}

/* =========================================
   GET ONE
========================================= */

export async function getGateMovement(
  id: string
) {
  const { data } =
    await axiosInstance.get<GateMovementResponse>(
      `/gate-movements/${id}`
    );

  return data;
}

/* =========================================
   CREATE
========================================= */

export async function createGateMovement(
  payload: CreateGateMovementDto
) {
  const { data } =
    await axiosInstance.post<GateMovementResponse>(
      "/gate-movements",
      payload
    );

  return data;
}

/* =========================================
   UPDATE
========================================= */

export async function updateGateMovement({
  id,
  payload,
}: {
  id: string;

  payload: UpdateGateMovementDto;
}) {
  const { data } =
    await axiosInstance.patch<GateMovementResponse>(
      `/gate-movements/${id}`,
      payload
    );

  return data;
}

/* =========================================
   UPDATE STATUS
========================================= */

export async function updateGateMovementStatus({
  id,
  status,
}: {
  id: string;

  status: GateMovementStatus;
}) {
  const { data } =
    await axiosInstance.patch<GateMovementResponse>(
      `/gate-movements/${id}/status`,
      {
        status,
      }
    );

  return data;
}

/* =========================================
   DELETE
========================================= */

export async function deleteGateMovement(
  id: string
) {
  const { data } =
    await axiosInstance.delete(
      `/gate-movements/${id}`
    );

  return data;
}

/* =========================================
   STATISTICS
========================================= */

export async function getGateStatistics() {
  const { data } =
    await axiosInstance.get<GateStatisticsResponse>(
      "/gate-movements/statistics"
    );

  return data;
}