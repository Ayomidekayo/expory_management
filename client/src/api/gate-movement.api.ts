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
   RELATED SHIPMENT
========================================= */

export interface GateMovementShipment {
  id: string;

  shipmentNumber: string;

  shipmentDate: string;

  status: string;

  transportMode: string;

  bookingNumber?: string | null;

  shippingLine?: string | null;

  vesselName?: string | null;

  voyageNumber?: string | null;

  client?: {
    id: string;

    companyName: string;
  } | null;

  exporter?: {
    id: string;

    name: string;
  } | null;

  consignee?: {
    id: string;

    name: string;
  } | null;

  allocation?: unknown;
}

/* =========================================
   RELATED CONTAINER
========================================= */

export interface GateMovementContainer {
  id: string;

  containerNumber: string;

  shipment?: GateMovementShipment | null;
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

  crossedAt?: string | null;

  clearedAt?: string | null;

  notes?: string | null;

  createdAt: string;

  updatedAt: string;

  container?: GateMovementContainer | null;
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

  /*
   * Required by the backend.
   * The edit page should normally keep this read-only
   * when the gate movement is already attached to a container.
   */
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

  shipmentId?: string;

  shipmentNumber?: string;

  pagination?: {
    page?: number;
    limit?: number;
  };
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