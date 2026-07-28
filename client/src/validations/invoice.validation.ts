

/* ===========================================
   ENUMS
=========================================== */

import z from "zod";
import type { Shipment } from "../types";

export type Currency =
  | "NGN"
  | "USD"
  | "EUR";

export type InvoiceStatus =
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
   INVOICE
=========================================== */

export interface Invoice {
  id: string;

  shipmentId: string;

  shipment: Shipment;

  invoiceNumber: string;

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
   CREATE DTO
=========================================== */

export interface CreateInvoiceDto {
  shipmentId: string;

  invoiceDate: string;

  currency: Currency;

  exchangeRate?: number;

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
    | "total"
    | "createdAt"
    | "updatedAt"
  >[];
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
datePreset?:
  | "TODAY"
  | "THIS_WEEK"
  | "THIS_MONTH"
  | "THIS_QUARTER"
  | "THIS_YEAR";

  sortBy?:
    | "invoiceDate"
    | "invoiceNumber"
    | "createdAt"
    | "totalAmount";

  sortOrder?: "asc" | "desc";
}



export const createInvoiceSchema = z.object({
  shipmentId: z.string().min(1),

  invoiceDate: z.string().min(1),

  currency: z.enum([
    "NGN",
    "USD",
    "EUR",
  ]),

  exchangeRate: z.coerce.number().optional(),

  paymentTerms: z
    .enum([
      "CASH",
      "ADVANCE",
      "COD",
      "NET_15",
      "NET_30",
      "NET_60",
      "LETTER_OF_CREDIT",
    ])
    .optional(),

  status: z
    .enum([
      "DRAFT",
      "SENT",
      "APPROVED",
      "PAID",
      "CANCELLED",
    ])
    .default("DRAFT"),

  incoterm: z.string().optional(),

  commercialReference:
    z.string().optional(),

  transportUnits:
    z.coerce.number().optional(),

  freight: z.coerce.number(),

  remarks: z.string().optional(),

  items: z.array(
    z.object({
      description: z.string().min(1),

      hsCode: z.string().optional(),

      packageType: z.string().optional(),

      packages: z.coerce.number().optional(),

      grossWeight:
        z.coerce.number().optional(),

      netWeight:
        z.coerce.number().optional(),

      quantity: z.coerce.number(),

      unit: z.string().optional(),

      unitPrice:
        z.coerce.number(),

      remarks: z.string().optional(),
    })
  ),
});

export const updateInvoiceSchema = createInvoiceSchema.partial();

export type CreateInvoiceInput =
  z.infer<typeof createInvoiceSchema>;

export type UpdateInvoiceInput =
  z.infer<typeof updateInvoiceSchema>;