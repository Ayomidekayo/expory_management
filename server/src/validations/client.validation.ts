import { z } from "zod";

export const createClientSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name is required."),

  clientType: z.enum([
    "COMPANY",
    "INDIVIDUAL",
  ]),

  contactPerson: z
    .string()
    .trim()
    .optional(),

  email: z
    .string()
    .email("Invalid email.")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .optional(),

  alternatePhone: z
    .string()
    .trim()
    .optional(),

  address: z
    .string()
    .trim()
    .optional(),

  city: z
    .string()
    .trim()
    .optional(),

  state: z
    .string()
    .trim()
    .optional(),

  country: z
    .string()
    .trim()
    .optional(),

  website: z
    .string()
    .url("Invalid website.")
    .optional()
    .or(z.literal("")),

  taxNumber: z
    .string()
    .trim()
    .optional(),

  remarks: z
    .string()
    .trim()
    .optional(),
});

export const updateClientSchema =
  createClientSchema.partial();

export type CreateClientDto =
  z.infer<typeof createClientSchema>;

export type UpdateClientDto =
  z.infer<typeof updateClientSchema>;