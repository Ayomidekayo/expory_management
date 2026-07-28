import { z } from "zod";

import {
  AllocationPriority,
  AllocationStatus,
  ServiceType,
  TransportMode,
} from "../generated";

export const createAllocationSchema = z.object({
  // Client Information
  clientId: z.string().min(1, "Client is required."),
  exporterId: z.string().optional(),
  consigneeId: z.string().optional(),

  // Service
  serviceType: z.nativeEnum(ServiceType),

  priority: z
    .nativeEnum(AllocationPriority)
    .default(AllocationPriority.MEDIUM),

  status: z
    .nativeEnum(AllocationStatus)
    .default(AllocationStatus.PENDING),

  // Cargo
  cargoDescription: z
    .string()
    .min(1, "Cargo description is required."),

  cargoType: z.string().optional(),
  commodityCode: z.string().optional(),
  commodityName: z.string().optional(),

  quantity: z.coerce.number().optional(),

  packageType: z.string().optional(),

  numberOfPackages: z.coerce.number().optional(),

  grossWeight: z.coerce.number().optional(),

  netWeight: z.coerce.number().optional(),

  volume: z.coerce.number().optional(),

  // Shipping

  originCountry: z.string().optional(),
  originCity: z.string().optional(),
  pickupAddress: z.string().optional(),

 pickupDate: z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional()
),

  destinationCountry: z
    .string()
    .min(1, "Destination country is required."),

  destinationCity: z.string().optional(),

  destinationPort: z.string().optional(),

  portOfLoading: z.string().optional(),

  portOfDischarge: z.string().optional(),

  transportMode: z
    .nativeEnum(TransportMode)
    .optional(),

  shippingLine: z.string().optional(),

  incoterm: z.string().optional(),

  deliveryAddress: z.string().optional(),

  expectedShipmentDate: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().datetime().optional()
  ),

  // Finance

  estimatedValue: z.coerce.number().optional(),

  currency: z.string().optional(),

  paymentTerms: z.string().optional(),

  freightType: z.string().optional(),

  insuranceRequired: z
    .boolean()
    .default(false),

  // Remarks

  specialInstruction: z.string().optional(),

  internalRemark: z.string().optional(),
});

export const updateAllocationSchema =
  createAllocationSchema.partial();

export type CreateAllocationDto =
  z.infer<typeof createAllocationSchema>;

export type UpdateAllocationDto =
  z.infer<typeof updateAllocationSchema>;