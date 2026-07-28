import { z } from "zod";

export const createContainerSchema = z.object({
  shipmentId: z.string().cuid(),

  packingListId: z.string().cuid().optional(),

  containerNumber: z.string().min(1, "Container number is required"),

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

export const updateContainerSchema =
  createContainerSchema.partial();

export type CreateContainerInput =
  z.infer<typeof createContainerSchema>;

export type UpdateContainerInput =
  z.infer<typeof updateContainerSchema>;