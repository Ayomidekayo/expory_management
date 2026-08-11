import { z } from "zod";

/* ===========================================
   ENUMS
=========================================== */

export const currencies = [
  "NGN",
  "USD",
  "EUR",
] as const;

export const invoiceStatuses = [
  "UNPAID",
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
  (value) =>
    value === "" ? undefined : value,
  z.string().optional()
);

const optionalNumber = z.preprocess(
  (value) =>
    value === "" ? undefined : value,
  z.coerce.number().optional()
);

/* ===========================================
   CREATE INVOICE
=========================================== */

export const createInvoiceSchema = z.object({
  /*
   * Shipment
   */
  shipmentId: z
    .string()
    .min(1, "Shipment is required"),

  /*
   * Invoice date
   */
  invoiceDate: z
    .string()
    .min(1, "Invoice date is required"),

  /*
   * Currency
   */
  currency: z.enum(currencies),

  /*
   * Exchange rate
   */
  exchangeRate: optionalNumber,

  /*
   * Invoice number supplied by
   * client/vendor.
   *
   * This is different from the
   * system-generated invoiceNumber.
   */
  externalInvoiceNumber: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  /*
   * Invoice status
   *
   * Defaults to UNPAID.
   */
  status: z
    .enum(invoiceStatuses)
    .default("UNPAID"),

  /*
   * Payment terms
   */
  paymentTerms: z
    .enum(paymentTerms)
    .optional(),

  /*
   * Incoterm
   */
  incoterm: optionalString,

  /*
   * Commercial reference
   */
  commercialReference:
    optionalString,

  /*
   * Number of transport units
   */
  transportUnits:
    optionalNumber,

  /*
   * Freight
   */
  freight: z.coerce
    .number()
    .min(
      0,
      "Freight cannot be negative"
    ),

  /*
   * Remarks
   */
  remarks: optionalString,

  /*
   * Invoice items
   */
  items: z
    .array(
      z.object({
        description: z
          .string()
          .min(
            1,
            "Item description is required"
          ),

        hsCode: optionalString,

        packageType: optionalString,

        packages: optionalNumber,

        grossWeight: optionalNumber,

        netWeight: optionalNumber,

        quantity: z.coerce
          .number()
          .positive(
            "Quantity must be greater than zero"
          ),

        unit: optionalString,

        unitPrice: z.coerce
          .number()
          .min(
            0,
            "Unit price cannot be negative"
          ),

        remarks: optionalString,
      })
    )
    .min(
      1,
      "At least one invoice item is required."
    ),
});

/* ===========================================
   UPDATE INVOICE STATUS
=========================================== */

export const updateInvoiceStatusSchema =
  z.object({
    status: z.enum(invoiceStatuses),
  });

/* ===========================================
   UPDATE INVOICE
=========================================== */

export const updateInvoiceSchema =
  createInvoiceSchema.partial();

/* ===========================================
   TYPES
=========================================== */

export type CreateInvoiceDto =
  z.infer<
    typeof createInvoiceSchema
  >;

export type UpdateInvoiceDto =
  z.infer<
    typeof updateInvoiceSchema
  >;

export type UpdateInvoiceStatusDto =
  z.infer<
    typeof updateInvoiceStatusSchema
  >;