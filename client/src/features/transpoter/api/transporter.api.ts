 // Adjust this path to your actual Axios file.

import api from "../../../lib/axios";
import type {
  ApiResponse,
  CreateTransporterPayload,
  Pagination,
  Transporter,
  TransporterItem,
  TransporterListResponse,
  TransporterPayment,
  TransporterPaymentPayload,
  TransporterQuery,
  TransporterItemInput,
  UpdateTransporterItemPayload,
  UpdateTransporterPayload,
} from "../types/transporter";

const basePath = "/transporters";

/* ===========================================
   GET ALL TRANSPORTERS
=========================================== */

export async function getTransporters(
  query: TransporterQuery
): Promise<TransporterListResponse> {
  const response = await api.get<{
    success: boolean;
    message?: string;
    data: Transporter[];
    pagination: Pagination;
  }>(basePath, {
    params: query,
  });

  return response.data;
}

/* ===========================================
   GET SINGLE TRANSPORTER
=========================================== */

export async function getTransporter(
  id: string
): Promise<Transporter> {
  const response = await api.get<ApiResponse<Transporter>>(
    `${basePath}/${id}`
  );

  return response.data.data;
}

/* ===========================================
   CREATE TRANSPORTER
=========================================== */

export async function createTransporter(
  payload: CreateTransporterPayload
): Promise<Transporter> {
  const response = await api.post<ApiResponse<Transporter>>(
    basePath,
    payload
  );

  return response.data.data;
}

/* ===========================================
   UPDATE TRANSPORTER
=========================================== */

export async function updateTransporter(
  id: string,
  payload: UpdateTransporterPayload
): Promise<Transporter> {
  const response = await api.patch<ApiResponse<Transporter>>(
    `${basePath}/${id}`,
    payload
  );

  return response.data.data;
}

/* ===========================================
   DELETE TRANSPORTER
=========================================== */

export async function deleteTransporter(
  id: string
) {
  const response = await api.delete<ApiResponse<null>>(
    `${basePath}/${id}`
  );

  return response.data;
}

/* ===========================================
   ADD TRANSPORTER ITEM
=========================================== */

export async function addTransporterItem(
  id: string,
  payload: TransporterItemInput
): Promise<TransporterItem> {
  const response = await api.post<ApiResponse<TransporterItem>>(
    `${basePath}/${id}/items`,
    payload
  );

  return response.data.data;
}

/* ===========================================
   UPDATE TRANSPORTER ITEM
=========================================== */

export async function updateTransporterItem(
  id: string,
  itemId: string,
  payload: UpdateTransporterItemPayload
): Promise<TransporterItem> {
  const response = await api.patch<ApiResponse<TransporterItem>>(
    `${basePath}/${id}/items/${itemId}`,
    payload
  );

  return response.data.data;
}

/* ===========================================
   DELETE TRANSPORTER ITEM
=========================================== */

export async function deleteTransporterItem(
  id: string,
  itemId: string
) {
  const response = await api.delete<ApiResponse<null>>(
    `${basePath}/${id}/items/${itemId}`
  );

  return response.data;
}

/* ===========================================
   GET ITEM PAYMENT HISTORY
=========================================== */

export async function getTransporterItemPayments(
  id: string,
  itemId: string
): Promise<TransporterPayment[]> {
  const response = await api.get<ApiResponse<TransporterPayment[]>>(
    `${basePath}/${id}/items/${itemId}/payments`
  );

  return response.data.data;
}

/* ===========================================
   CREATE TRANSPORTER PAYMENT
=========================================== */

export async function createTransporterPayment(
  id: string,
  itemId: string,
  payload: TransporterPaymentPayload
): Promise<TransporterPayment> {
  const response = await api.post<ApiResponse<TransporterPayment>>(
    `${basePath}/${id}/items/${itemId}/payments`,
    payload
  );

  return response.data.data;
}