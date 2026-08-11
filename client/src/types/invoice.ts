import type { Shipment } from "./shipment.types";

/* ===========================================
   ENUMS
=========================================== */

export type Currency =
  | "NGN"
  | "USD"
  | "EUR";

export type InvoiceStatus =
  | "UNPAID"
  | "DRAFT"
  | "SENT"
  | "APPROVED"
  | "PAID"
  | "CANCELLED";

export type PaymentTerms =
  | "CASH"
  | "ADVANCE"
  | "COD"
  | "NET_15"
  | "NET_30"
  | "NET_60"
  | "LETTER_OF_CREDIT";

/* ===========================================
   INVOICE ITEM
=========================================== */

export interface InvoiceItem {
  id: string;

  invoiceId: string;

  description: string;

  hsCode?: string;

  packageType?: string;

  packages?: number;

  grossWeight?: number;

  netWeight?: number;

  quantity: number;

  unit?: string;

  unitPrice: number;

  total: number;

  remarks?: string;

  createdAt: string;

  updatedAt: string;
}

/* ===========================================
   DOCUMENT
=========================================== */

export interface Document {
  id: string;

  fileName: string;

  fileUrl: string;

  documentType: string;

  createdAt: string;
}

/* ===========================================
   INVOICE
=========================================== */

export interface Invoice {
  id: string;

  shipmentId: string;

  shipment: Shipment;

  invoiceNumber: string;

  externalInvoiceNumber?: string | null;

  invoiceDate: string;

  currency: Currency;

  exchangeRate?: number;

  paymentTerms?: PaymentTerms;

  status: InvoiceStatus;

  incoterm?: string;

  commercialReference?: string;

  transportUnits?: number;

  freight: number;

  subtotal: number;

  totalAmount: number;

  remarks?: string;

  items: InvoiceItem[];

  documents: Document[];

  createdAt: string;

  updatedAt: string;

  _count?: {
    items: number;

    documents: number;
  };
}

/* ===========================================
   CREATE INVOICE DTO
=========================================== */

export interface CreateInvoiceDto {
  shipmentId: string;

  invoiceDate: string;

  currency: Currency;

  exchangeRate?: number;

  externalInvoiceNumber?: string;

  paymentTerms?: PaymentTerms;

  status?: InvoiceStatus;

  incoterm?: string;

  commercialReference?: string;

  transportUnits?: number;

  freight: number;

  remarks?: string;

  items: Omit<
    InvoiceItem,
    | "id"
    | "invoiceId"
    | "total"
    | "createdAt"
    | "updatedAt"
  >[];
}

/* ===========================================
   CREATE INVOICE ITEM DTO
=========================================== */

export interface CreateInvoiceItemDto {
  description: string;

  hsCode?: string;

  packageType?: string;

  packages?: number;

  grossWeight?: number;

  netWeight?: number;

  quantity: number;

  unit?: string;

  unitPrice: number;

  remarks?: string;
}

/* ===========================================
   UPDATE DTO
=========================================== */

export type UpdateInvoiceDto =
  Partial<CreateInvoiceDto>;

/* ===========================================
   QUERY
=========================================== */

export interface InvoiceQuery {
  page?: number;

  limit?: number;

  search?: string;

  status?: InvoiceStatus;

  currency?: Currency;

  shipmentId?: string;

  fromDate?: string;

  toDate?: string;

  datePreset?:
    | "TODAY"
    | "THIS_WEEK"
    | "THIS_MONTH"
    | "THIS_QUARTER"
    | "THIS_YEAR";

  sortBy?:
    | "invoiceDate"
    | "createdAt"
    | "invoiceNumber"
    | "totalAmount";

  sortOrder?: "asc" | "desc";
}