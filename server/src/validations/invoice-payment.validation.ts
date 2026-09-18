import { z } from "zod";

export const createInvoicePaymentSchema = z.object({
  invoiceId: z.string().min(1, "Invoice is required."),

  invoiceItemId: z
    .string()
    .optional()
    .nullable(),

  amount: z.coerce
    .number()
    .positive("Payment amount must be greater than zero."),

  description: z
    .string()
    .trim()
    .optional(),

  paymentDate: z
    .string()
    .min(1, "Payment date is required."),

  paymentMethod: z
    .string()
    .trim()
    .optional(),

  reference: z
    .string()
    .trim()
    .optional(),

  notes: z
    .string()
    .trim()
    .optional(),
});

export const updateInvoicePaymentSchema =
  z.object({
    invoiceItemId: z
      .string()
      .optional()
      .nullable(),

    amount: z.coerce
      .number()
      .positive("Payment amount must be greater than zero."),

    description: z
      .string()
      .trim()
      .optional(),

    paymentDate: z
      .string()
      .min(1, "Payment date is required."),

    paymentMethod: z
      .string()
      .trim()
      .optional(),

    reference: z
      .string()
      .trim()
      .optional(),

    notes: z
      .string()
      .trim()
      .optional(),
  });

export type CreateInvoicePaymentDto =
  z.infer<typeof createInvoicePaymentSchema>;

export type UpdateInvoicePaymentDto =
  z.infer<typeof updateInvoicePaymentSchema>;