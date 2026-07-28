import api from "../../lib/axios";

export interface InvoiceItem {
  id: string;

  invoiceId: string;

  description: string;

  quantity: number;

  unitPrice: number;

  total: number;

  createdAt: string;
}

export const getInvoiceItems = async (
  invoiceId: string
) => {
  const { data } = await api.get(
    `/invoice-items/invoice/${invoiceId}`
  );

  return data.data;
};

export const createInvoiceItem = async (
  payload: {
    invoiceId: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }
) => {
  const { data } = await api.post(
    "/invoice-items",
    payload
  );

  return data.data;
};

export const updateInvoiceItem = async (
  id: string,
  payload: Partial<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>
) => {
  const { data } = await api.patch(
    `/invoice-items/${id}`,
    payload
  );

  return data.data;
};

export const deleteInvoiceItem = async (
  id: string
) => {
  await api.delete(`/invoice-items/${id}`);
};