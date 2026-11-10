
import { z } from "zod";

/* ===========================================
   HELPERS
=========================================== */

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional()
);

/* ===========================================
   COMMON TRANSPORT ITEM FIELDS
=========================================== */

const commonTransportItemFields = {
  itemDate: z
    .string()
    .min(1, "Item date is required."),

  name: optionalString,

  ownerName: z
    .string()
    .min(1, "Owner name is required."),

  chargeAmount: z.coerce
    .number()
    .min(0, "Charge amount cannot be negative."),

  chargeCurrency: z
    .enum(["NGN", "USD", "EUR", "CFA"])
    .default("NGN"),

  remarks: optionalString,
};

/* ===========================================
   TRUCK ITEM
=========================================== */

const truckItemSchema = z.object({
  ...commonTransportItemFields,

  itemType: z.literal("TRUCK"),

  frontPlateNumber: z
    .string()
    .min(1, "Front plate number is required."),

  backPlateNumber: z
    .string()
    .min(1, "Back plate number is required."),

  containerName: optionalString,

  containerNumber: optionalString,
});

/* ===========================================
   CONTAINER ITEM
=========================================== */

const containerItemSchema = z.object({
  ...commonTransportItemFields,

  itemType: z.literal("CONTAINER"),

  containerName: z
    .string()
    .min(1, "Container name is required."),

  containerNumber: z
    .string()
    .min(1, "Container number is required."),

  frontPlateNumber: optionalString,

  backPlateNumber: optionalString,
});

/* ===========================================
   TRANSPORT ITEM
=========================================== */

export const transportItemSchema =
  z.discriminatedUnion("itemType", [
    truckItemSchema,
    containerItemSchema,
  ]);

/* ===========================================
   CREATE TRANSPORT
=========================================== */

export const createTransportSchema = z.object({
 shipmentId: z.preprocess(
  (value) => (value === "" ? null : value),
  z.string().nullable().optional()
),

  transportDate: z
    .string()
    .min(1, "Transport date is required."),

  remarks: optionalString,

  items: z
    .array(transportItemSchema)
    .min(1, "At least one transport item is required."),
});

/* ===========================================
   UPDATE TRANSPORT ITEM
=========================================== */

// Existing items include their database ID.
// New items do not need an ID.

const updateTruckItemSchema =
  truckItemSchema.extend({
    id: z.string().min(1).optional(),
  });

const updateContainerItemSchema =
  containerItemSchema.extend({
    id: z.string().min(1).optional(),
  });

export const updateTransportItemSchema =
  z.discriminatedUnion("itemType", [
    updateTruckItemSchema,
    updateContainerItemSchema,
  ]);

/* ===========================================
   UPDATE TRANSPORT
=========================================== */

export const updateTransportSchema = z.object({
 shipmentId: z.preprocess(
  (value) => (value === "" ? null : value),
  z.string().nullable().optional()
),

  transportDate: z
    .string()
    .min(1, "Transport date cannot be empty.")
    .optional(),

  remarks: optionalString,

  items: z
    .array(updateTransportItemSchema)
    .optional(),
});

/* ===========================================
   TYPES
=========================================== */

export type CreateTransportDto = z.infer<
  typeof createTransportSchema
>;

export type UpdateTransportDto = z.infer<
  typeof updateTransportSchema
>;

export type TransportItemDto = z.infer<
  typeof transportItemSchema
>;

export type UpdateTransportItemDto = z.infer<
  typeof updateTransportItemSchema
>;
