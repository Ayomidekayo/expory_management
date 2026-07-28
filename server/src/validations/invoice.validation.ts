import { z } from "zod";

/* ===========================================
   ENUMS
=========================================== */

export const currencies = [
  "NGN",
  "USD",
  "EUR",
] as const;

export const invoiceStatus = [
  "DRAFT",
  "SENT",
  "APPROVED",
  "PAID",
  "CANCELLED",
] as const;

export const paymentTerms = [
  "CASH",
  "ADVANCE",
  "COD",
  "NET_15",
  "NET_30",
  "NET_60",
  "LETTER_OF_CREDIT",
] as const;

/* ===========================================
   HELPERS
=========================================== */

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional()
);

const optionalNumber = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.number().optional()
);

/* ===========================================
   CREATE
=========================================== */

export const createInvoiceSchema = z.object({
  shipmentId: z.string().min(1),

  invoiceDate: z.string().min(1),

  currency: z.enum(currencies),

  exchangeRate: optionalNumber,

  paymentTerms: z
    .enum(paymentTerms)
    .optional(),

  status: z
    .enum(invoiceStatus)
    .default("DRAFT"),

  incoterm: optionalString,

  commercialReference: optionalString,

  transportUnits: optionalNumber,

  freight: z.coerce.number(),

  remarks: optionalString,

  // ✅ ADD THIS
  items: z
    .array(
      z.object({
        description: z.string().min(1),

        hsCode: optionalString,

        packageType: optionalString,

        packages: optionalNumber,

        grossWeight: optionalNumber,

        netWeight: optionalNumber,

        quantity: z.coerce.number(),

        unit: optionalString,

        unitPrice: z.coerce.number(),

        remarks: optionalString,
      })
    )
    .min(1, "At least one invoice item is required."),
});

export const updateInvoiceSchema =
  createInvoiceSchema.partial();

export type CreateInvoiceDto =
  z.infer<
    typeof createInvoiceSchema
  >;

export type UpdateInvoiceDto =
  z.infer<
    typeof updateInvoiceSchema
  >;