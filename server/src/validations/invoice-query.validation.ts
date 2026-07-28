import { z } from "zod";

const optionalDate = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional()
);

export const InvoiceQueryDto = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  search: z.string().optional(),

  status: z
    .enum([
      "DRAFT",
      "SENT",
      "APPROVED",
      "PAID",
      "CANCELLED",
    ])
    .optional(),

  currency: z
    .enum([
      "NGN",
      "USD",
      "EUR",
    ])
    .optional(),

  shipmentId: z.string().optional(),

  // NEW
  fromDate: optionalDate,

  // NEW
  toDate: optionalDate,
datePreset: z
    .enum([
      "TODAY",
      "THIS_WEEK",
      "THIS_MONTH",
      "THIS_QUARTER",
      "THIS_YEAR",
    ])
    .optional(),

  sortBy: z
    .enum([
      "invoiceDate",
      "createdAt",
      "invoiceNumber",
      "totalAmount",
    ])
    .default("createdAt"),

  sortOrder: z
    .enum([
      "asc",
      "desc",
    ])
    .default("desc"),
});

export type InvoiceQuery =
  z.infer<typeof InvoiceQueryDto>;