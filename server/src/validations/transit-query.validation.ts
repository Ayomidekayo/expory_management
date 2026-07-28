import { z } from "zod";

import {
  transportModes,
} from "./transit.validation";

export const TransitQueryDto = z.object({

  page: z.coerce
    .number()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .default(10),

  search: z
    .string()
    .optional(),

  shipmentId: z
    .string()
    .optional(),

  containerId: z
    .string()
    .optional(),

  transportMode: z
    .enum(transportModes)
    .optional(),

  sortBy: z.enum([
    "createdAt",
    "origin",
    "destination",
    "transportMode",
    "quantity",
    "totalPrice",
  ])
  .default("createdAt"),

  sortOrder: z.enum([
    "asc",
    "desc",
  ])
  .default("desc"),

});

export type TransitQuery =
  z.infer<
    typeof TransitQueryDto
  >;