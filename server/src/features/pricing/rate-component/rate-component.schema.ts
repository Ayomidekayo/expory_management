import { z } from "zod";

const codeSchema = z
  .string()
  .trim()
  .min(2)
  .max(50)
  .regex(/^[A-Za-z0-9_-]+$/)
  .transform((value) => value.toUpperCase());

const nameSchema = z.string().trim().min(2).max(120);

const moneySchema = z.number().finite().min(0);

export const createRateComponentSchema = z
  .object({
    name: nameSchema,
    code: codeSchema.optional(),

    calculationType: z.enum([
      "FIXED",
      "WEIGHT_SLAB",
      "PERCENTAGE",
      "PER_UNIT",
      "VARIABLE",
    ]),

    calculationBasis: z
      .enum(["SUBTOTAL", "CUSTOMS_VALUE", "FREIGHT_AMOUNT"])
      .nullable()
      .optional(),

    unit: z.string().trim().max(50).nullable().optional(),

    value: moneySchema.nullable().optional(),
    percentage: z.number().finite().min(0).max(100).nullable().optional(),

    isActive: z.boolean().default(true),
    isOptional: z.boolean().default(false),
    isTaxable: z.boolean().default(false),

    notes: z.string().trim().max(1000).nullable().optional(),

    optionId: z.string().trim().min(1).nullable().optional(),
    pricingSectionId: z.string().trim().min(1).nullable().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (
      data.calculationType === "FIXED" &&
      data.value == null
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["value"],
        message: "A fixed charge requires a value.",
      });
    }

    if (
      data.calculationType === "PERCENTAGE" &&
      data.percentage == null
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["percentage"],
        message: "A percentage charge requires a percentage.",
      });
    }

    if (
      data.calculationType === "WEIGHT_SLAB" &&
      data.value != null
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["value"],
        message: "Weight-slab prices must be configured in the weight-slab module.",
      });
    }
  });

export const updateRateComponentSchema = z
  .object({
    name: nameSchema.optional(),
    code: codeSchema.nullable().optional(),

    calculationType: z
      .enum([
        "FIXED",
        "WEIGHT_SLAB",
        "PERCENTAGE",
        "PER_UNIT",
        "VARIABLE",
      ])
      .optional(),

    calculationBasis: z
      .enum(["SUBTOTAL", "CUSTOMS_VALUE", "FREIGHT_AMOUNT"])
      .nullable()
      .optional(),

    unit: z.string().trim().max(50).nullable().optional(),
    value: moneySchema.nullable().optional(),
    percentage: z.number().finite().min(0).max(100).nullable().optional(),

    isActive: z.boolean().optional(),
    isOptional: z.boolean().optional(),
    isTaxable: z.boolean().optional(),

    notes: z.string().trim().max(1000).nullable().optional(),

    optionId: z.string().trim().min(1).nullable().optional(),
    pricingSectionId: z.string().trim().min(1).nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  });

export const rateComponentIdParamsSchema = z.object({
  componentId: z.string().trim().min(1),
});

export const rateCardIdParamsSchema = z.object({
  rateCardId: z.string().trim().min(1),
});

export const componentListQuerySchema = z.object({
  configurationId: z.string().optional(),
  pricingSectionId: z.string().optional(),
  optionId: z.string().optional(),
  activeOnly: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
});

export type CreateRateComponentInput = z.infer<
  typeof createRateComponentSchema
>;

export type UpdateRateComponentInput = z.infer<
  typeof updateRateComponentSchema
>;