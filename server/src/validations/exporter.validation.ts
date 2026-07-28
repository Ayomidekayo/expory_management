import { z } from "zod";

export const createExporterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Exporter name is required."),

  contactPerson: z
    .string()
    .trim()
    .optional(),

  email: z
    .string()
    .trim()
    .email("Invalid email address.")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .optional(),

  address: z
    .string()
    .trim()
    .optional(),
});

export const updateExporterSchema =
  createExporterSchema.partial();

export type CreateExporterDto =
  z.infer<typeof createExporterSchema>;

export type UpdateExporterDto =
  z.infer<typeof updateExporterSchema>;