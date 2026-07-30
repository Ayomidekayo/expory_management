
import type { AllocationQuery } from "../types/allocation.types";
import type { ClientQuery } from "../types/client.types";
import type { ConsigneeQuery } from "../types/consignee";
import type { ExporterQuery } from "../types/exporter.types";

import type { ShipmentQuery } from "../types/shipment.types";

export const queryKeys = {
  allocations: {
    all: ["allocations"] as const,

    list: (params?: AllocationQuery) =>
      ["allocations", params] as const,

    detail: (id: string) =>
      ["allocations", id] as const,

    available: () =>
      ["allocations", "available"] as const,
  },

  clients: {
    all: ["clients"] as const,

    list: (params?: ClientQuery) =>
      ["clients", params] as const,

    detail: (id: string) =>
      ["clients", id] as const,
  },

  exporters: {
    all: ["exporters"] as const,

    list: (params?: ExporterQuery) =>
      ["exporters", params] as const,

    detail: (id: string) =>
      ["exporters", id] as const,
  },

  consignees: {
    all: ["consignees"] as const,

    list: (params?: ConsigneeQuery) =>
      ["consignees", params] as const,

    detail: (id: string) =>
      ["consignees", id] as const,
  },

  shipments: {
    all: ["shipments"] as const,

    list: (params?: ShipmentQuery) =>
      ["shipments", params] as const,

    detail: (id: string) =>
      ["shipments", id] as const,

    available: () =>
      ["shipments", "available"] as const,
  },
};