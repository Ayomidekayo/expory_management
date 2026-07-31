export const ContainerType = {
  DRY: "DRY",
  REEFER: "REEFER",
  OPEN_TOP: "OPEN_TOP",
  FLAT_RACK: "FLAT_RACK",
  TANK: "TANK",
} as const;

export const ContainerSize = {
  FT20: "FT20",
  FT40: "FT40",
  FT40_HC: "FT40_HC",
  FT45: "FT45",
} as const;

export const transportModes = [
  "ROAD",
  "SEA",
  "AIR",
] as const;

export type TransportMode =
  (typeof transportModes)[number];

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

export type ShipmentStatus =
  (typeof shipmentStatuses)[number];