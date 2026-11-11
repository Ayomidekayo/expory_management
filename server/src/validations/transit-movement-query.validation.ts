


import { z } from "zod";

export const transitMovementQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),

    search: z.string().trim().max(100).optional(),

    direction: z.enum(["IN", "OUT"]).optional(),

    clientName: z.string().trim().max(150).optional(),

    shipmentId: z.string().trim().min(1).optional(),

    association: z.enum(["LINKED", "INDEPENDENT"]).optional(),

    fromDate: z.coerce.date().optional(),

    toDate: z.coerce.date().optional(),

    isLocked: z.enum(["true", "false"]).optional(),

    sortBy: z
      .enum([
        "transitDate",
        "transitNumber",
        "createdAt",
        "updatedAt",
      ])
      .default("createdAt"),

    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .superRefine((data, ctx) => {
    if (
      data.fromDate &&
      data.toDate &&
      data.fromDate > data.toDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toDate"],
        message: "End date cannot be earlier than start date.",
      });
    }
  });

export type TransitMovementQuery = z.infer<
  typeof transitMovementQuerySchema
>;
