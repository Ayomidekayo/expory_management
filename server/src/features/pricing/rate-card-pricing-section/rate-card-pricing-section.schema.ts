import { z } from "zod";

const codeSchema = z
  .string()
  .trim()
  .min(2, "Code must contain at least 2 characters.")
  .max(50, "Code cannot exceed 50 characters.")
  .regex(
    /^[A-Za-z0-9_-]+$/,
    "Code may contain only letters, numbers, underscores, and hyphens.",
  )
  .transform((value) => value.toUpperCase());

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must contain at least 2 characters.")
  .max(100, "Name cannot exceed 100 characters.");

const currencySchema = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .pipe(z.enum(["NGN", "CFA"]));

const displayOrderSchema = z.number().int().min(0);

export const createPricingSectionSchema = z
  .object({
    code: codeSchema,
    name: nameSchema,
    currency: currencySchema,
    optionId: z.string().trim().min(1).nullable().optional(),
    displayOrder: displayOrderSchema.default(0),
    isActive: z.boolean().default(true),
  })
  .strict();

export const updatePricingSectionSchema = z
  .object({
    name: nameSchema.optional(),
    currency: currencySchema.optional(),
    optionId: z.string().trim().min(1).nullable().optional(),
    displayOrder: displayOrderSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Provide at least one field to update.",
    },
  );

export const pricingSectionIdParamsSchema = z.object({
  sectionId: z.string().trim().min(1),
});

export const configurationIdParamsSchema = z.object({
  configurationId: z.string().trim().min(1),
});

export const pricingSectionListQuerySchema = z.object({
  activeOnly: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
});

export type CreatePricingSectionInput = z.infer<
  typeof createPricingSectionSchema
>;

export type UpdatePricingSectionInput = z.infer<
  typeof updatePricingSectionSchema
>;