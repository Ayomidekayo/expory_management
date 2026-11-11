
import { z } from "zod";

const optionalText = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === ""
      ? undefined
      : value,
  z.string().trim().max(500).optional(),
);

export const createTransitMovementPaymentSchema = z.object({
  amount: z.coerce
    .number()
    .finite()
    .positive()
    .max(9999999999999999),

  paymentType: z.enum(["ADVANCE", "REGULAR"]),

  paymentDate: z.coerce.date().optional(),

  paymentMethod: optionalText,
  reference: optionalText,
  description: optionalText,
  notes: optionalText,
});

export type CreateTransitMovementPaymentDto = z.infer<
  typeof createTransitMovementPaymentSchema
>;
