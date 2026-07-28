import { z } from "zod";

export const ClientQueryDto = z.object({
  page: z.coerce.number().default(1),

  limit: z.coerce.number().default(10),

  search: z.string().optional(),

  clientType: z
    .enum(["COMPANY", "INDIVIDUAL"])
    .optional(),

  country: z.string().optional(),

  isActive: z
    .preprocess((value) => {
      if (value === "true") return true;
      if (value === "false") return false;
      return undefined;
    }, z.boolean().optional()),
});

export type ClientQueryDto =
  z.infer<typeof ClientQueryDto>;