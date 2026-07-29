import { z } from "zod";

/*
=====================================
Create Container
=====================================
*/

export const createContainerSchema = z.object({
  shipmentId: z.string().cuid(),

  packingListId: z.string().cuid().optional(),

  containerNumber: z
    .string()
    .min(1, "Container number is required"),

  sealNumber: z.string().optional(),

  containerType: z.enum([
    "DRY",
    "REEFER",
    "OPEN_TOP",
    "FLAT_RACK",
    "TANK",
  ]),

  containerSize: z.enum([
    "FT20",
    "FT40",
    "FT40_HC",
    "FT45",
  ]),

  grossWeight: z.coerce.number().optional(),

  netWeight: z.coerce.number().optional(),

  tareWeight: z.coerce.number().optional(),

  volume: z.coerce.number().optional(),

  loadingLocation: z.string().optional(),

  destination: z.string().optional(),

  shippingLine: z.string().optional(),

  bookingReference: z.string().optional(),

  containerCondition: z.string().optional(),

  status: z.enum([
    "EMPTY",
    "LOADED",
    "IN_TRANSIT",
    "DELIVERED",
  ]),
});

/*
=====================================
Update Container
=====================================
*/

export const updateContainerSchema =
  createContainerSchema.partial();

/*
=====================================
Types
=====================================
*/

// Raw values received from the form
export type CreateContainerInput =
  z.input<typeof createContainerSchema>;

// Values after Zod has parsed/coerced them
export type CreateContainerOutput =
  z.output<typeof createContainerSchema>;

export type UpdateContainerInput =
  z.input<typeof updateContainerSchema>;

export type UpdateContainerOutput =
  z.output<typeof updateContainerSchema>;