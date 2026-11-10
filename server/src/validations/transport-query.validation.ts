
import { z } from "zod";

export const TransportQueryDto = z.object({
  page: z.coerce
    .number()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .default(10),

  search: z.string().optional(),

  shipmentId: z.string().optional(),

  sortBy: z
    .enum([
      "transportDate",
      "transportNumber",
      "createdAt",
    ])
    .default("createdAt"),

  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc"),
});

export type TransportQuery = z.infer<
  typeof TransportQueryDto
>;
