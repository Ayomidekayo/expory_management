import axiosInstance from "../../lib/axios";

import type {
  InvoiceItem,
} from "../../types/invoice";
import type { CreateInvoiceItemDto } from "../../types/invoice-item";

interface InvoiceItemResponse {
  success: boolean;
  data: InvoiceItem;
}

interface InvoiceItemsResponse {
  success: boolean;
  data: InvoiceItem[];
}

/* ===========================================
   GET ALL ITEMS FOR INVOICE
=========================================== */

export async function getInvoiceItems(
  invoiceId: string
) {
  const { data } =
    await axiosInstance.get<InvoiceItemsResponse>(
      `/invoice-items/${invoiceId}`
    );

  return data;
}

/* ===========================================
   CREATE ITEM
=========================================== */

export async function createInvoiceItem({
  invoiceId,
  data,
}: {
  invoiceId: string;
  data: CreateInvoiceItemDto;
}) {
  const { data: response } =
    await axiosInstance.post<InvoiceItemResponse>(
      `/invoice-items/${invoiceId}`,
      data
    );

  return response;
}

/* ===========================================
   UPDATE ITEM
=========================================== */

export async function updateInvoiceItem(
  id: string,
  data: Partial<CreateInvoiceItemDto>
) {
  const { data: response } =
    await axiosInstance.patch<InvoiceItemResponse>(
      `/invoice-items/${id}`,
      data
    );

  return response;
}

/* ===========================================
   DELETE ITEM
=========================================== */

export async function deleteInvoiceItem(
  id: string
) {
  const { data } =
    await axiosInstance.delete(
      `/invoice-items/${id}`
    );

  return data;
}