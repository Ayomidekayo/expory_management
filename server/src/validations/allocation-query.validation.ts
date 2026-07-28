import { z } from "zod";

import {
  AllocationPriority,
  AllocationStatus,
  ServiceType,
  TransportMode,
} from "../generated";

export const AllocationQueryDto = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  search: z.string().optional(),

  status: z
    .nativeEnum(AllocationStatus)
    .optional(),

  priority: z
    .nativeEnum(AllocationPriority)
    .optional(),

  serviceType: z
    .nativeEnum(ServiceType)
    .optional(),

  transportMode: z
    .nativeEnum(TransportMode)
    .optional(),

  clientId: z.string().optional(),

  exporterId: z.string().optional(),

  consigneeId: z.string().optional(),

  assignedToId: z.string().optional(),

  createdById: z.string().optional(),

  approvedById: z.string().optional(),

  isActive: z.coerce.boolean().optional(),

  sortBy: z
    .enum([
      "createdAt",
      "updatedAt",
      "allocationNumber",
      "expectedShipmentDate",
      "priority",
      "status",
    ])
    .default("createdAt"),

  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc"),
});

export type AllocationQuery = z.infer<
  typeof AllocationQueryDto
>;