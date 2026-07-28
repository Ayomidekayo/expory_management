import { z } from "zod";

export const createExporterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Exporter name is required."),

  contactPerson: z
    .string()
    .optional(),

  email: z
    .string()
    .email("Invalid email.")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .optional(),

  address: z
    .string()
    .optional(),
});

export const updateExporterSchema =
  createExporterSchema.partial();

export type CreateExporterInput =
  z.infer<typeof createExporterSchema>;

export type UpdateExporterInput =
  z.infer<typeof updateExporterSchema>;