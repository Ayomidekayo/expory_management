import { z } from "zod";

export const transportModes = {
  ROAD: "ROAD",
  SEA: "SEA",
  AIR: "AIR",
} as const;

export const createTransitSchema = z.object({
  shipmentId: z
    .string()
    .min(1, "Shipment is required"),

  containerId: z
    .string()
    .min(1, "Container is required"),

  origin: z
    .string()
    .min(2, "Origin is required"),

  destination: z
    .string()
    .min(2, "Destination is required"),

  transportMode: z.enum(transportModes),

  transporter: z.string().optional(),

  transitInvoice: z.string().optional(),

  agentNumber: z.string().optional(),

  exporterNumber: z.string().optional(),

  wibNumber: z.string().optional(),

  description: z.string().optional(),

  quantity: z.coerce.number().optional(),

  unitPrice: z.coerce.number().optional(),

  totalPrice: z.coerce.number().optional(),
});

export const updateTransitSchema =
  createTransitSchema.partial();

export type CreateTransitInput =
  z.infer<typeof createTransitSchema>;

export type UpdateTransitInput =
  z.infer<typeof updateTransitSchema>;

export type TransportMode =
  (typeof transportModes)[keyof typeof transportModes];