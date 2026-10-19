import { z } from "zod";

export const createRateCardAirlineSchema = z
  .object({
    configurationId: z.string().trim().min(1),
    code: z.string().trim().min(1).max(50),
    name: z.string().trim().min(1).max(150),
    ratePerKg: z.number().finite().positive(),
    displayOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export const updateRateCardAirlineSchema = z
  .object({
    code: z.string().trim().min(1).max(50).optional(),
    name: z.string().trim().min(1).max(150).optional(),
    ratePerKg: z.number().finite().positive().optional(),
    displayOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (input) => Object.keys(input).length > 0,
    {
      message: "At least one field must be provided.",
    },
  );

export type CreateRateCardAirlineInput = z.infer<
  typeof createRateCardAirlineSchema
>;

export type UpdateRateCardAirlineInput = z.infer<
  typeof updateRateCardAirlineSchema
>;