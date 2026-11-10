import { z } from "zod";

export const createTransportPaymentSchema = z.object({
  amount: z.coerce.number().positive("Payment amount must be greater than zero"),

  paymentType: z.enum(["ADVANCE", "REGULAR"]),

  paymentDate: z.string().optional(),

  paymentMethod: z.string().trim().optional(),
  reference: z.string().trim().optional(),
  description: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type CreateTransportPaymentDto = z.infer<
  typeof createTransportPaymentSchema
>;