import { z } from "zod";
import { DocumentType } from "../generated";

/*
=====================================
Helpers
=====================================
*/

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional()
);

/*
=====================================
Document Query
=====================================
*/

export const DocumentQueryDto = z.object({
  page: z.coerce
    .number()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .default(10),

  search: optionalString,

  allocationId: optionalString,

  shipmentId: optionalString,

  containerId: optionalString,

  packingListId: optionalString,

  invoiceId: optionalString,

  transitId: optionalString,

  type: z
    .preprocess(
      (value) => (value === "" ? undefined : value),
      z.nativeEnum(DocumentType).optional()
    ),

  sortBy: z
    .enum([
      "uploadedAt",
      "updatedAt",
      "fileName",
      "type",
    ])
    .default("uploadedAt"),

  sortOrder: z
    .enum([
      "asc",
      "desc",
    ])
    .default("desc"),
});

export type DocumentQuery =
  z.infer<typeof DocumentQueryDto>;