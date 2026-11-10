
import api from "../lib/axios";

import type {
  Transport,
  TransportQuery,
  CreateTransportPayload,
  UpdateTransportPayload,
  TransportPayment,
  TransportColumnKey,
} from "../types/transport";



export interface TransportPaymentPayload {
  amount: number;
  paymentType: "ADVANCE" | "REGULAR";
  paymentDate?: string;
  paymentMethod?: string;
  reference?: string;
  description?: string;
  notes?: string;
}

export interface TransportPaymentSummary {
  chargeAmount: number | string;
  totalPaid: number | string;
  balance: number | string;
  paymentStatus: "UNPAID" | "ADVANCE" | "PARTIALLY_PAID" | "PAID";
  currency: string;
}

export interface TransportPaymentHistoryResponse {
  payments: TransportPayment[];
  summary: TransportPaymentSummary;
}

export interface TransportColumnLock {
  columnKey: TransportColumnKey;
  isLocked: boolean;
  lockedAt?: string | null;
  lockReason?: string | null;
}

// GET ALL TRANSPORTS
export async function getTransports(params?: TransportQuery) {
  const response = await api.get("/transports", { params });
  return response.data;
}

// GET ONE TRANSPORT
export async function getTransport(id: string): Promise<Transport> {
  const response = await api.get(`/transports/${id}`);
  return response.data.data;
}

// CREATE TRANSPORT
export async function createTransport(payload: CreateTransportPayload) {
  const response = await api.post("/transports", payload);
  return response.data.data;
}

// UPDATE TRANSPORT

export async function updateTransport(
  id: string,
  payload: UpdateTransportPayload,
) {
  console.log("========== FRONTEND UPDATE ==========");
  console.log("Transport ID:", id);
  console.log("Payload:", payload);
  console.log("Payload type:", typeof payload);
  console.log("=====================================");

  if (!payload || typeof payload !== "object") {
    throw new Error("Transport update payload is missing.");
  }

  const response = await api.patch(
    `/transports/${id}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data;
}


// DELETE TRANSPORT
export async function deleteTransport(id: string) {
  const response = await api.delete(`/transports/${id}`);
  return response.data;
}

// GET ITEM PAYMENT HISTORY
export async function getTransportPayments(
  itemId: string,
): Promise<TransportPaymentHistoryResponse> {
  const response = await api.get(`/transports/items/${itemId}/payments`);
  return response.data.data;
}

// ADD ITEM PAYMENT
export async function createTransportPayment(
  itemId: string,
  payload: TransportPaymentPayload,
) {
  const response = await api.post(
    `/transports/items/${itemId}/payments`,
    payload,
  );

  return response.data.data;
}

// GET GLOBAL COLUMN LOCKS
export async function getTransportColumnLocks(): Promise<TransportColumnLock[]> {
  const response = await api.get("/transports/column-locks");
  return response.data.data;
}

// UPDATE GLOBAL COLUMN LOCK
export async function updateTransportColumnLock(
  columnKey: TransportColumnKey,
  payload: {
    isLocked: boolean;
    lockReason?: string;
  },
) {
  const response = await api.patch(
    `/transports/column-locks/${columnKey}`,
    payload,
  );

  return response.data.data;
}

// LOCK / UNLOCK AN INDIVIDUAL ITEM
export async function updateTransportItemLock(
  itemId: string,
  isLocked: boolean,
) {
  const response = await api.patch(
    `/transports/items/${itemId}/lock`,
    { isLocked },
  );

  return response.data.data;
}
