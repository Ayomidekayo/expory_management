import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional()
);

const optionalDate = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional()
);

export const createShipmentSchema =
  z.object({
    shipmentDate: z
      .string()
      .min(1, "Shipment date is required."),

    clientId: z
      .string()
      .min(1, "Client is required."),

    exporterId: z
      .string()
      .min(1, "Exporter is required."),

    consigneeId: z
      .string()
      .min(1, "Consignee is required."),

    allocationId: optionalString,

    transportMode: z
      .enum([
        "ROAD",
        "SEA",
        "AIR",
        "RAIL",
      ], {
        required_error:
          "Transport mode is required.",
      }),

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

    expectedDeparture:
      optionalDate,

    expectedArrival:
      optionalDate,

    actualDeparture:
      optionalDate,

    actualArrival:
      optionalDate,

    remarks: optionalString,

    status: z
      .enum([
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
      ])
      .default("DRAFT"),
  });

export const updateShipmentSchema =
  createShipmentSchema.partial();

export type CreateShipmentInput =
  z.infer<
    typeof createShipmentSchema
  >;

export type UpdateShipmentInput =
  z.infer<
    typeof updateShipmentSchema
  >;