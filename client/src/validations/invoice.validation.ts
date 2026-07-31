import z from "zod";

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

      packages:
        z.coerce.number().optional(),

      grossWeight:
        z.coerce.number().optional(),

      netWeight:
        z.coerce.number().optional(),

      quantity:
        z.coerce.number(),

      unit: z.string().optional(),

      unitPrice:
        z.coerce.number(),

      remarks:
        z.string().optional(),
    })
  ),
});

export const updateInvoiceSchema =
  createInvoiceSchema.partial();

/* ===========================================
   FORM TYPES
=========================================== */

export type CreateInvoiceInput =
  z.input<typeof createInvoiceSchema>;

export type CreateInvoiceOutput =
  z.output<typeof createInvoiceSchema>;

export type UpdateInvoiceInput =
  z.input<typeof updateInvoiceSchema>;

export type UpdateInvoiceOutput =
  z.output<typeof updateInvoiceSchema>;