import { z } from "zod";

/* ===========================================
   ENUMS
=========================================== */

export const containerTypes = [
  "DRY",
  "REEFER",
  "OPEN_TOP",
  "FLAT_RACK",
  "TANK",
] as const;

export const containerSizes = [
  "FT20",
  "FT40",
  "FT45",
] as const;

export const containerStatuses = [
  "EMPTY",
  "LOADED",
  "IN_TRANSIT",
] as const;

/* ===========================================
   HELPERS
=========================================== */

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional()
);

const optionalNumber = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.number().optional()
);

/* ===========================================
   CREATE
=========================================== */

export const createContainerSchema =
  z.object({
    shipmentId: z.string().min(1, "Shipment is required"),

    packingListId: optionalString,

    containerNumber: z
      .string()
      .min(1, "Container number is required"),

    sealNumber: optionalString,

    containerType: z.enum(containerTypes),

    containerSize: z.enum(containerSizes),

    grossWeight: optionalNumber,

    netWeight: optionalNumber,

    tareWeight: optionalNumber,

    volume: optionalNumber,

    loadingLocation: optionalString,

    destination: optionalString,

    status: z
      .enum(containerStatuses)
      .default("EMPTY"),

    shippingLine: optionalString,

    bookingReference: optionalString,

    containerCondition: optionalString,
  });

/* ===========================================
   UPDATE
=========================================== */

export const updateContainerSchema =
  createContainerSchema.partial();

/* ===========================================
   TYPES
=========================================== */

export type CreateContainerDto =
  z.infer<typeof createContainerSchema>;

export type UpdateContainerDto =
  z.infer<typeof updateContainerSchema>;