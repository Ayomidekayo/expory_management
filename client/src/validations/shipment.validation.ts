import { z } from "zod";

const optionalString = z.string().optional();

const optionalDate = z.string().optional();

export const transportModes = [
  "ROAD",
  "SEA",
  "AIR",
  "RAIL",
] as const;

export const shipmentStatuses = [
  "DRAFT",
  "READY",
  "BOOKED",
  "LOADED",
  "IN_TRANSIT",
  "ARRIVED",
  "CUSTOMS_CLEARANCE",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
] as const;

export const createShipmentSchema = z.object({
  shipmentDate: z.string().min(1),
  clientId: z.string().min(1),
  exporterId: z.string().min(1),
  consigneeId: z.string().min(1),

  allocationId: optionalString,

  transportMode: z.enum(transportModes),

  status: z.enum(shipmentStatuses),

  xfNumber: optionalString,
  nxpNumber: optionalString,
  cciNumber: optionalString,
  eNumber: optionalString,

  bookingNumber: optionalString,
  shippingLine: optionalString,
  vesselName: optionalString,
  voyageNumber: optionalString,

  portOfLoading: optionalString,
  portOfDischarge: optionalString,

  expectedDeparture: optionalDate,
  expectedArrival: optionalDate,
  actualDeparture: optionalDate,
  actualArrival: optionalDate,

  remarks: optionalString,
});

export type CreateShipmentInput =
  z.output<typeof createShipmentSchema>;