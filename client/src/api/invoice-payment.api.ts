import api from "../lib/axios";


export interface InvoicePayment {
  id: string;
  invoiceId: string;
  invoiceItemId?: string | null;
  amount: number | string;
  description?: string | null;
  paymentDate: string;
  paymentMethod?: string | null;
  reference?: string | null;
  notes?: string | null;
  invoiceItem?: {
    id: string;
    description: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoicePaymentSummary {
  invoiceTotal: number;
  totalPaid: number;
  outstandingBalance: number;
  status:
    | "UNPAID"
    | "PARTIALLY_PAID"
    | "PAID"
    | "DRAFT"
    | "SENT"
    | "APPROVED"
    | "CANCELLED";
}

export interface InvoicePaymentsResponse {
  payments: InvoicePayment[];
  summary: InvoicePaymentSummary;
}

export interface CreateInvoicePaymentInput {
  invoiceId: string;
  invoiceItemId?: string;
  amount: number;
  description?: string;
  paymentDate: string;
  paymentMethod?: string;
  reference?: string;
  notes?: string;
}

export interface UpdateInvoicePaymentInput {
  invoiceItemId?: string;
  amount: number;
  description?: string;
  paymentDate: string;
  paymentMethod?: string;
  reference?: string;
  notes?: string;
}

export async function getInvoicePayments(
  invoiceId: string
): Promise<InvoicePaymentsResponse> {
  const response = await api.get(
    `/invoice-payments/invoice/${invoiceId}`
  );

  return response.data.data;
}

export async function getInvoicePayment(
  id: string
): Promise<InvoicePayment> {
  const response = await api.get(
    `/invoice-payments/${id}`
  );

  return response.data.data;
}

export async function createInvoicePayment(
  data: CreateInvoicePaymentInput
) {
  const response = await api.post(
    "/invoice-payments",
    data
  );

  return response.data.data;
}

export async function updateInvoicePayment(
  id: string,
  data: UpdateInvoicePaymentInput
) {
  const response = await api.patch(
    `/invoice-payments/${id}`,
    data
  );

  return response.data.data;
}

export async function deleteInvoicePayment(
  id: string
) {
  const response = await api.delete(
    `/invoice-payments/${id}`
  );

  return response.data.data;
}