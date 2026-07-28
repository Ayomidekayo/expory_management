import { z } from "zod";

import {
  ShipmentStatus,
  TransportMode,
} from "../generated";

const optionalDate = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional()
);

export const createShipmentSchema = z.object({
  shipmentDate: z.string(),

  xfNumber: z.string().optional(),

  nxpNumber: z.string().optional(),

  cciNumber: z.string().optional(),

  eNumber: z.string().optional(),

  bookingNumber: z.string().optional(),

  transportMode: z.nativeEnum(
    TransportMode
  ),

  shippingLine: z.string().optional(),

  vesselName: z.string().optional(),

  voyageNumber: z.string().optional(),

  portOfLoading: z.string().optional(),

  portOfDischarge: z.string().optional(),

  expectedDeparture:
    optionalDate,

  expectedArrival:
    optionalDate,

  actualDeparture:
    optionalDate,

  actualArrival:
    optionalDate,

  remarks: z.string().optional(),

  status: z
    .nativeEnum(
      ShipmentStatus
    )
    .optional(),

  clientId: z.string().min(1),

  exporterId: z.string().min(1),

  consigneeId: z.string().min(1),

  allocationId:
    z.string().optional(),
});

export const updateShipmentSchema =
  createShipmentSchema.partial();

export type CreateShipmentDto =
  z.infer<
    typeof createShipmentSchema
  >;

export type UpdateShipmentDto =
  z.infer<
    typeof updateShipmentSchema
  >;