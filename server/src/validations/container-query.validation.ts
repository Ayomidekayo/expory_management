import { z } from "zod";

import {
  containerStatuses,
  containerTypes,
  containerSizes,
} from "./container.validation";

export const ContainerQueryDto = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  search: z.string().optional(),

  shipmentId: z.string().optional(),

  packingListId: z.string().optional(),

  status: z
    .enum(containerStatuses)
    .optional(),

  containerType: z
    .enum(containerTypes)
    .optional(),

  containerSize: z
    .enum(containerSizes)
    .optional(),

  sortBy: z
    .enum([
      "createdAt",
      "containerNumber",
      "grossWeight",
      "status",
    ])
    .default("createdAt"),

  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc"),
});

export type ContainerQuery =
  z.infer<typeof ContainerQueryDto>;