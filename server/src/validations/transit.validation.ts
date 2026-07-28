import { z } from "zod";

/* ===========================================
   ENUMS
=========================================== */

export const transportModes = [
  "ROAD",
  "SEA",
  "AIR",
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

export const createTransitSchema =
  z.object({

    shipmentId: z
      .string()
      .min(1, "Shipment is required"),

    containerId: z
      .string()
      .min(1, "Container is required"),

    origin: z
      .string()
      .min(1, "Origin is required"),

    destination: z
      .string()
      .min(1, "Destination is required"),

    transportMode: z.enum(
      transportModes
    ),

    transporter: optionalString,

    transitInvoice: optionalString,

    agentNumber: optionalString,

    exporterNumber: optionalString,

    wibNumber: optionalString,

    quantity: optionalNumber,

    description: optionalString,

    unitPrice: optionalNumber,

    totalPrice: optionalNumber,

  });

/* ===========================================
   UPDATE
=========================================== */

export const updateTransitSchema =
  createTransitSchema.partial();

/* ===========================================
   TYPES
=========================================== */

export type CreateTransitDto =
  z.infer<
    typeof createTransitSchema
  >;

export type UpdateTransitDto =
  z.infer<
    typeof updateTransitSchema
  >;