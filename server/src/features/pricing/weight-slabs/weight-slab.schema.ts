import { z } from "zod";

const nullableId = z.string().trim().min(1).nullable().optional();

export const createWeightSlabSchema = z
  .object({
    label: z.string().trim().min(1, "Label is required").max(100),

    minWeightKg: z.number().finite().min(0),

    maxWeightKg: z.number().finite().positive().nullable().optional(),

    displayOrder: z.number().int().min(0).default(0),

    configurationId: nullableId,
    optionId: nullableId,
    pricingSectionId: nullableId,
  })
  .strict()
  .superRefine((data, ctx) => {
    if (
      data.maxWeightKg !== undefined &&
      data.maxWeightKg !== null &&
      data.maxWeightKg <= data.minWeightKg
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["maxWeightKg"],
        message: "Maximum weight must be greater than minimum weight.",
      });
    }
  });

export const updateWeightSlabSchema = z
  .object({
    label: z.string().trim().min(1).max(100).optional(),

    minWeightKg: z.number().finite().min(0).optional(),

    maxWeightKg: z.number().finite().positive().nullable().optional(),

    displayOrder: z.number().int().min(0).optional(),

    configurationId: nullableId,
    optionId: nullableId,
    pricingSectionId: nullableId,
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export const weightSlabParamsSchema = z.object({
  weightSlabId: z.string().trim().min(1),
});

export const rateCardParamsSchema = z.object({
  rateCardId: z.string().trim().min(1),
});

export const configurationParamsSchema = z.object({
  configurationId: z.string().trim().min(1),
});

export const listWeightSlabsQuerySchema = z.object({
  configurationId: z.string().trim().min(1).optional(),
  optionId: z.string().trim().min(1).optional(),
  pricingSectionId: z.string().trim().min(1).optional(),
});

export const upsertSlabRatesSchema = z
  .object({
    rates: z
      .array(
        z
          .object({
            componentId: z.string().trim().min(1),
            amount: z.number().finite().min(0),
          })
          .strict(),
      )
      .min(1, "At least one slab rate is required."),
  })
  .strict()
  .superRefine((data, ctx) => {
    const ids = data.rates.map((rate) => rate.componentId);

    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rates"],
        message: "A component can only appear once in the submitted rates.",
      });
    }
  });

export type CreateWeightSlabInput = z.infer<
  typeof createWeightSlabSchema
>;

export type UpdateWeightSlabInput = z.infer<
  typeof updateWeightSlabSchema
>;

export type UpsertSlabRatesInput = z.infer<
  typeof upsertSlabRatesSchema
>;