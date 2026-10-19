import { z } from "zod";

const nullableText = z.string().trim().max(120).nullable().optional();

export const createRateCardConfigurationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  code: z.string().trim().min(2).max(40).regex(/^[A-Za-z0-9_-]+$/),
  currency: z.string().trim().min(3).max(3).optional(),
  routeCode: nullableText,
  routeLabel: nullableText,
  equipmentType: nullableText,
  airlineSelectorEnabled: z.boolean().optional(),
  transportEnabled: z.boolean().optional(),
  nafdacEnabled: z.boolean().optional(),
  vatEnabled: z.boolean().optional(),
  vatPercentage: z.number().finite().min(0).max(100).optional(),
  vatCalculationBasis: z.enum(["SUBTOTAL", "CUSTOMS_VALUE", "FREIGHT_AMOUNT"]).nullable().optional(),
  weightEnabled: z.boolean().optional(),
  freightAmountEnabled: z.boolean().optional(),
  customsValueEnabled: z.boolean().optional(),
  quantityEnabled: z.boolean().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
}).strict();

export const updateRateCardConfigurationSchema =
  createRateCardConfigurationSchema.partial().strict();
