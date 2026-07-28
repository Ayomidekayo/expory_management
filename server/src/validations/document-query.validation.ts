import { z } from "zod";
import { DocumentType } from "../generated";

export const DocumentQueryDto =
  z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(10),

    search: z.string().optional(),

    shipmentId: z.string().optional(),

    containerId: z.string().optional(),

    packingListId: z.string().optional(),

    invoiceId: z.string().optional(),

    transitId: z.string().optional(),

    type: z
      .nativeEnum(DocumentType)
      .optional(),

    sortBy: z
      .enum([
        "uploadedAt",
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