import { z } from "zod";

export const createRateCardOptionSchema = z.object({
  configurationId: z.string().min(1).optional(),
  code: z.string().trim().min(1).max(60),
  name: z.string().trim().min(1).max(120),
  displayOrder: z.coerce.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateRateCardOptionSchema = createRateCardOptionSchema
  .omit({ configurationId: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one field to update.",
  });

export type CreateRateCardOptionInput = z.infer<typeof createRateCardOptionSchema>;
export type UpdateRateCardOptionInput = z.infer<typeof updateRateCardOptionSchema>;
