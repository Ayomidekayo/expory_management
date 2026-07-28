export const TransportMode = {
  ROAD: "ROAD",
  SEA: "SEA",
  AIR: "AIR",
} as const;

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