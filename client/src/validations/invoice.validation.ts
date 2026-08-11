import z from "zod";

/* ===========================================
   CREATE INVOICE
=========================================== */

export const createInvoiceSchema = z.object({
  shipmentId: z
    .string()
    .min(1, "Shipment is required"),

  invoiceDate: z
    .string()
    .min(1, "Invoice date is required"),

  currency: z.enum([
    "NGN",
    "USD",
    "EUR",
  ]),

  exchangeRate: z.coerce
    .number()
    .optional(),

  /*
   * Invoice number supplied by
   * client/vendor.
   */
  externalInvoiceNumber: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

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

  /*
   * Default invoice status
   */
  status: z
    .enum([
      "UNPAID",
      "DRAFT",
      "SENT",
      "APPROVED",
      "PAID",
      "CANCELLED",
    ])
    .default("UNPAID"),

  incoterm: z
    .string()
    .optional(),

  commercialReference:
    z.string().optional(),

  transportUnits:
    z.coerce.number().optional(),

  freight: z.coerce
    .number()
    .min(
      0,
      "Freight cannot be negative"
    ),

  remarks:
    z.string().optional(),

  items: z
    .array(
      z.object({
        description: z
          .string()
          .min(
            1,
            "Description is required"
          ),

        hsCode:
          z.string().optional(),

        packageType:
          z.string().optional(),

        packages:
          z.coerce
            .number()
            .optional(),

        grossWeight:
          z.coerce
            .number()
            .optional(),

        netWeight:
          z.coerce
            .number()
            .optional(),

        quantity:
          z.coerce.number(),

        unit:
          z.string().optional(),

        unitPrice:
          z.coerce.number(),

        remarks:
          z.string().optional(),
      })
    )
    .min(
      1,
      "At least one invoice item is required."
    ),
});

/* ===========================================
   UPDATE
=========================================== */

export const updateInvoiceSchema =
  createInvoiceSchema.partial();

/* ===========================================
   FORM TYPES
=========================================== */

export type CreateInvoiceInput =
  z.input<
    typeof createInvoiceSchema
  >;

export type CreateInvoiceOutput =
  z.output<
    typeof createInvoiceSchema
  >;

export type UpdateInvoiceInput =
  z.input<
    typeof updateInvoiceSchema
  >;

export type UpdateInvoiceOutput =
  z.output<
    typeof updateInvoiceSchema
  >;