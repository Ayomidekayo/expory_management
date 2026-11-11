
import api from "../lib/axios";

import type {
  TransitMovement,
  TransitMovementQuery,
  TransitMovementListResponse,
  CreateTransitMovementPayload,
  UpdateTransitMovementPayload,
  TransitMovementPayment,
  TransitMovementPaymentPayload,
  TransitMovementColumnLock,
  TransitMovementColumnKey,
} from "../types/transit-movement";

// GET ALL TRANSIT MOVEMENTS
export async function getTransitMovements(
  params?: TransitMovementQuery,
): Promise<TransitMovementListResponse> {
  const response = await api.get("/transit-movements", {
    params,
  });

  return response.data;
}

// GET ONE TRANSIT MOVEMENT
export async function getTransitMovement(
  id: string,
): Promise<TransitMovement> {
  const response = await api.get(`/transit-movements/${id}`);
  return response.data.data;
}

// GET MOVEMENTS BY SHIPMENT
export async function getTransitMovementsByShipment(
  shipmentId: string,
): Promise<TransitMovement[]> {
  const response = await api.get(
    `/transit-movements/shipment/${shipmentId}`,
  );

  return response.data.data;
}

// CREATE TRANSIT MOVEMENT
export async function createTransitMovement(
  payload: CreateTransitMovementPayload,
): Promise<TransitMovement> {
  const response = await api.post(
    "/transit-movements",
    payload,
  );

  return response.data.data;
}

// UPDATE TRANSIT MOVEMENT
export async function updateTransitMovement(
  id: string,
  payload: UpdateTransitMovementPayload,
): Promise<TransitMovement> {
  const response = await api.patch(
    `/transit-movements/${id}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data.data;
}

// DELETE TRANSIT MOVEMENT
export async function deleteTransitMovement(
  id: string,
) {
  const response = await api.delete(
    `/transit-movements/${id}`,
  );

  return response.data;
}

// GET ITEM PAYMENT HISTORY
export async function getTransitMovementPayments(
  itemId: string,
): Promise<TransitMovementPayment[]> {
  const response = await api.get(
    `/transit-movements/items/${itemId}/payments`,
  );

  return response.data.data;
}

// RECORD ITEM PAYMENT
export async function createTransitMovementPayment(
  itemId: string,
  payload: TransitMovementPaymentPayload,
): Promise<TransitMovementPayment> {
  const response = await api.post(
    `/transit-movements/items/${itemId}/payments`,
    payload,
  );

  return response.data.data;
}

// GET GLOBAL COLUMN LOCKS
export async function getTransitMovementColumnLocks():
  Promise<TransitMovementColumnLock[]> {
  const response = await api.get(
    "/transit-movements/column-locks",
  );

  return response.data.data;
}

// UPDATE GLOBAL COLUMN LOCK
export async function updateTransitMovementColumnLock(
  columnKey: TransitMovementColumnKey,
  payload: {
    isLocked: boolean;
    lockReason?: string;
  },
): Promise<TransitMovementColumnLock> {
  const response = await api.patch(
    `/transit-movements/column-locks/${columnKey}`,
    payload,
  );

  return response.data.data;
}

// LOCK / UNLOCK INDIVIDUAL ITEM
export async function updateTransitMovementItemLock(
  itemId: string,
  isLocked: boolean,
) {
  const response = await api.patch(
    `/transit-movements/items/${itemId}/lock`,
    { isLocked },
  );

  return response.data.data;
}
