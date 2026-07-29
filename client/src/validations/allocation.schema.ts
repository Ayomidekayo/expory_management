import { z } from "zod";

/* ===========================================
   ENUMS
=========================================== */

const serviceTypes = [
  "EXPORT_DOCUMENTATION",
  "CUSTOMS_CLEARANCE",
  "FREIGHT_FORWARDING",
  "HAULAGE",
  "CONTAINER_BOOKING",
  "INSPECTION",
  "WAREHOUSING",
  "INSURANCE",
  "OTHER",
] as const;

const priorities = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
] as const;

const transportModes = [
  "ROAD",
  "SEA",
  "AIR",
  "RAIL",
] as const;

/* ===========================================
   REUSABLE SCHEMAS
=========================================== */

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional()
);

const optionalNumber = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.number().nonnegative().optional()
);

const optionalInteger = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.number().int().nonnegative().optional()
);

const optionalDate = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().datetime().optional()
);

/* ===========================================
   CREATE ALLOCATION
=========================================== */

export const createAllocationSchema = z.object({
  /* CLIENT */

  clientId: z
    .string()
    .min(1, "Client is required."),

  exporterId: optionalString,

  consigneeId: optionalString,

  /* SERVICE */

  serviceType: z.enum(serviceTypes),

  priority: z.enum(priorities),

  /* CARGO */

  cargoDescription: z
    .string()
    .min(3, "Cargo description is required."),

  cargoType: optionalString,

  commodityCode: optionalString,

  commodityName: optionalString,

  quantity: optionalNumber,

  packageType: optionalString,

  numberOfPackages: optionalInteger,

  grossWeight: optionalNumber,

  netWeight: optionalNumber,

  volume: optionalNumber,

  /* SHIPPING */

  originCountry: optionalString,

  originCity: optionalString,

  pickupAddress: optionalString,

  pickupDate: optionalDate,

  destinationCountry: z
    .string()
    .min(1, "Destination country is required."),

  destinationCity: optionalString,

  portOfLoading: optionalString,

  portOfDischarge: optionalString,

  transportMode: z
    .enum(transportModes)
    .optional(),

  shippingLine: optionalString,

  incoterm: optionalString,

  deliveryAddress: optionalString,

  expectedShipmentDate: optionalDate,

  destinationPort: optionalString,

  /* FINANCIAL */

  estimatedValue: optionalNumber,

  currency: optionalString,

  paymentTerms: optionalString,

  freightType: optionalString,

  insuranceRequired: z.boolean().default(false),

  /* REMARKS */

  specialInstruction: optionalString,

  internalRemark: optionalString,

  /* WORKFLOW */

  assignedToId: optionalString,
});

/* ===========================================
   UPDATE
=========================================== */

export const updateAllocationSchema =
  createAllocationSchema.partial();

/* ===========================================
   TYPES
=========================================== */

export type CreateAllocationInput =
  z.input<typeof createAllocationSchema>;

export type CreateAllocationOutput =
  z.output<typeof createAllocationSchema>;

export type UpdateAllocationInput =
  z.input<typeof updateAllocationSchema>;

export type UpdateAllocationOutput =
  z.output<typeof updateAllocationSchema>;