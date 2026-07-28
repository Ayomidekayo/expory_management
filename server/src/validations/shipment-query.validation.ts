import { z } from "zod";

import {
  ShipmentStatus,
  TransportMode,
} from "../generated";

export const ShipmentQueryDto =
  z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(10),

    search: z.string().optional(),

    status: z
      .nativeEnum(ShipmentStatus)
      .optional(),

    transportMode: z
      .nativeEnum(TransportMode)
      .optional(),

    clientId: z.string().optional(),

    exporterId: z.string().optional(),

    consigneeId: z.string().optional(),

    allocationId: z.string().optional(),

    sortBy: z
      .enum([
        "shipmentDate",
        "shipmentNumber",
        "createdAt",
      ])
      .default("createdAt"),

    sortOrder: z
      .enum(["asc", "desc"])
      .default("desc"),
  });

export type ShipmentQuery =
  z.infer<
    typeof ShipmentQueryDto
  >;