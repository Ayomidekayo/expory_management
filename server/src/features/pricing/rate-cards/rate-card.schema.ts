import { z } from "zod";

const dateString = z.iso.datetime({
  offset: true,
});

export const createRateCardSchema = z.object({
  name: z.string().trim().min(1).max(120),

  mode: z.enum(["AIR", "LAND", "SEA"]),

  direction: z.enum(["IMPORT", "EXPORT"]),

  currency: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{3}$/)
    .optional(),

  effectiveFrom: dateString.optional(),

  effectiveTo: dateString.nullable().optional(),
});

export const updateRateCardSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),

  currency: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{3}$/)
    .optional(),

  effectiveFrom: dateString.optional(),

  effectiveTo: dateString.nullable().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "Provide at least one field to update." },
);

export const rateCardIdSchema = z.object({
  id: z.string().min(1),
});

export const listRateCardsSchema = z.object({
  mode: z.enum(["AIR", "LAND", "SEA"]).optional(),

  direction: z.enum(["IMPORT", "EXPORT"]).optional(),

  status: z
    .enum(["DRAFT", "ACTIVE", "ARCHIVED"])
    .optional(),
});