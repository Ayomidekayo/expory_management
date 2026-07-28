import { z } from "zod";

export const createConsigneeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Consignee name is required."),

  contactPerson: z.string().optional(),

  address: z.string().optional(),

  phone: z.string().optional(),

  email: z
    .string()
    .email("Invalid email address.")
    .optional()
    .or(z.literal("")),

  transporter: z.string().optional(),

  placeOfLoading: z
    .string()
    .min(1, "Place of loading is required."),

  transitRoute: z
    .string()
    .min(1, "Transit route is required."),

  portOfDischarge: z
    .string()
    .min(1, "Port of discharge is required."),

  transportMode: z.enum([
    "ROAD",
    "SEA",
    "AIR",
    "RAIL",
  ]),
});

export const updateConsigneeSchema =
  createConsigneeSchema.partial();

/*
=====================================
DTO Types
=====================================
*/

export type CreateConsigneeDto =
  z.infer<typeof createConsigneeSchema>;

export type UpdateConsigneeDto =
  z.infer<typeof updateConsigneeSchema>;