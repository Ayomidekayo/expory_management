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
   CREATE ALLOCATION
=========================================== */

export const createAllocationSchema =
  z.object({
    /* CLIENT */

    clientId: z
      .string()
      .min(1, "Client is required."),

    exporterId: z.string().optional(),

    consigneeId: z.string().optional(),

    /* SERVICE */

    serviceType: z.enum(serviceTypes),

    priority: z.enum(priorities),

    /* CARGO */

    cargoDescription: z
      .string()
      .min(
        3,
        "Cargo description is required."
      ),

    cargoType: z.string().optional(),

    commodityCode: z.string().optional(),

    commodityName: z.string().optional(),

    quantity: z.coerce
      .number()
      .nonnegative()
      .optional(),

    packageType: z.string().optional(),

    numberOfPackages: z.coerce
      .number()
      .int()
      .nonnegative()
      .optional(),

    grossWeight: z.coerce
      .number()
      .nonnegative()
      .optional(),

    netWeight: z.coerce
      .number()
      .nonnegative()
      .optional(),

    volume: z.coerce
      .number()
      .nonnegative()
      .optional(),

    /* SHIPPING */

    originCountry: z.string().optional(),

    originCity: z.string().optional(),

    pickupAddress: z.string().optional(),

   pickupDate: z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().datetime().optional()
),


    destinationCountry: z
      .string()
      .min(
        1,
        "Destination country is required."
      ),

    destinationCity: z.string().optional(),

    portOfLoading: z.string().optional(),

    portOfDischarge: z.string().optional(),

    transportMode: z
      .enum(transportModes)
      .optional(),

    shippingLine: z.string().optional(),

    incoterm: z.string().optional(),

    deliveryAddress: z.string().optional(),

    expectedShipmentDate: z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().datetime().optional()
),

    destinationPort:
      z.string().optional(),

    /* FINANCIAL */

    estimatedValue: z.coerce
      .number()
      .nonnegative()
      .optional(),

    currency: z.string().optional(),

    paymentTerms: z.string().optional(),

    freightType: z.string().optional(),

    insuranceRequired:
      z.boolean().default(false),

    /* REMARKS */

    specialInstruction:
      z.string().optional(),

    internalRemark:
      z.string().optional(),

    /* WORKFLOW */

    assignedToId:
      z.string().optional(),
  });

/* ===========================================
   UPDATE
=========================================== */

export const updateAllocationSchema =
  createAllocationSchema.partial();

/* ===========================================
   TYPES
=========================================== */
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