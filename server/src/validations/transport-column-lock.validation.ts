import { z } from "zod";

export const transportColumnKeys = [
  "itemDate",
  "itemType",
  "name",
  "ownerName",
  "frontPlateNumber",
  "backPlateNumber",
  "containerName",
  "containerNumber",
  "chargeAmount",
  "chargeCurrency",
  "remarks",
] as const;

export const updateTransportColumnLockSchema = z.object({
  isLocked: z.boolean(),
  lockReason: z.string().trim().max(500).optional(),
});

export type TransportColumnKey =
  (typeof transportColumnKeys)[number];

export type UpdateTransportColumnLockDto = z.infer<
  typeof updateTransportColumnLockSchema
>;