
import { z } from "zod";

export const transitMovementColumnKeys = [
  "itemDate",
  "itemType",
  "name",
  "clientName",
  "frontPlateNumber",
  "backPlateNumber",
  "containerName",
  "containerNumber",
  "chargeAmount",
  "chargeCurrency",
  "remarks",
] as const;

export const transitMovementColumnKeySchema = z.enum(
  transitMovementColumnKeys,
);

export const updateTransitMovementColumnLockSchema = z.object({
  isLocked: z.boolean(),

  lockReason: z
    .string()
    .trim()
    .max(500)
    .optional(),
});

export const updateTransitMovementItemLockSchema = z.object({
  isLocked: z.boolean(),
});

export type TransitMovementColumnKey = z.infer<
  typeof transitMovementColumnKeySchema
>;

export type UpdateTransitMovementColumnLockDto = z.infer<
  typeof updateTransitMovementColumnLockSchema
>;

export type UpdateTransitMovementItemLockDto = z.infer<
  typeof updateTransitMovementItemLockSchema
>;
