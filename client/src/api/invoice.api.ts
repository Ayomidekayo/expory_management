import axiosInstance from "../lib/axios";
import type { CreateInvoiceDto, Invoice, InvoiceQuery, UpdateInvoiceDto } from "../types";

interface InvoiceListResponse {
  success: boolean;

  data: Invoice[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface InvoiceResponse {
  success: boolean;

  data: Invoice;
}

/* ===========================================
   GET ALL
=========================================== */

export async function getInvoices(
  params?: InvoiceQuery
) {
  const { data } =
    await axiosInstance.get<InvoiceListResponse>(
      "/invoices",
      {
        params,
      }
    );

  return data;
}

/* ===========================================
   GET ONE
=========================================== */

export async function getInvoice(
  id: string
) {
  const { data } =
    await axiosInstance.get<InvoiceResponse>(
      `/invoices/${id}`
    );

  return data;
}

/* ===========================================
   CREATE
=========================================== */

export async function createInvoice(
  payload: CreateInvoiceDto
) {
  const { data } =
    await axiosInstance.post<InvoiceResponse>(
      "/invoices",
      payload
    );

  return data;
}

/* ===========================================
   UPDATE
=========================================== */

export async function updateInvoice({
  id,
  payload,
}: {
  id: string;

  payload: UpdateInvoiceDto;
}) {
  const { data } =
    await axiosInstance.patch<InvoiceResponse>(
      `/invoices/${id}`,
      payload
    );

  return data;
}

/* ===========================================
   DELETE
=========================================== */

export async function deleteInvoice(
  id: string
) {
  const { data } =
    await axiosInstance.delete(
      `/invoices/${id}`
    );

  return data;
}