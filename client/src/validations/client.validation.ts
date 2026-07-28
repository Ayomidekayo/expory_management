import { z } from "zod";

export const createClientSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),

  clientType: z.enum([
    "COMPANY",
    "INDIVIDUAL",
  ]),

  contactPerson: z.string().optional(),

  email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),

  phone: z.string().optional(),

  alternatePhone: z.string().optional(),

  address: z.string().optional(),

  city: z.string().optional(),

  state: z.string().optional(),

  country: z.string().optional(),

  website: z.string().optional(),

  taxNumber: z.string().optional(),

  remarks: z.string().optional(),
});

export type CreateClientFormValues =
  z.infer<typeof createClientSchema>;