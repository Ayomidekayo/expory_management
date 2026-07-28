import { z } from "zod";

export const createConsigneeSchema = z.object({
  name: z.string().min(2, "Consignee name is required."),

  contactPerson: z.string().optional(),

  address: z.string().optional(),

  phone: z.string().optional(),

  email: z
    .string()
    .email("Invalid email.")
    .optional()
    .or(z.literal("")),

  transporter: z.string().optional(),

  placeOfLoading: z.string().min(1),

  transitRoute: z.string().min(1),

  portOfDischarge: z.string().min(1),

  transportMode: z.enum([
    "ROAD",
    "SEA",
    "AIR",
    "RAIL",
  ]),
});

export type CreateConsigneeInput =
  z.infer<typeof createConsigneeSchema>;