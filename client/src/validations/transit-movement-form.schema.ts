
import { z } from "zod";

const currencySchema = z.enum(["NGN", "USD", "EUR", "CFA"]);

const commonItemSchema = z.object({
  id: z.string().optional(),
  itemDate: z.string().min(1, "Item date is required"),
  name: z.string().trim().min(1, "Name is required"),
  clientName: z.string().trim().min(1, "Client name is required"),
  chargeAmount: z.coerce.number<number>()
    .finite()
    .min(0, "Charge cannot be negative"),
  chargeCurrency: currencySchema,
  remarks: z.string().optional(),
});

const truckSchema = commonItemSchema.extend({
  itemType: z.literal("TRUCK"),
  frontPlateNumber: z.string().optional(),
  backPlateNumber: z.string().optional(),
  containerName: z.string().optional(),
  containerNumber: z.string().optional(),
}).refine(
  (item) =>
    Boolean(
      item.frontPlateNumber?.trim() ||
      item.backPlateNumber?.trim()
    ),
  {
    message: "Enter at least one plate number",
    path: ["frontPlateNumber"],
  }
);

const containerSchema = commonItemSchema.extend({
  itemType: z.literal("CONTAINER"),
  containerName: z.string().trim().min(1, "Container name is required"),
  containerNumber: z.string().trim().min(1, "Container number is required"),
  frontPlateNumber: z.string().optional(),
  backPlateNumber: z.string().optional(),
});

export const transitMovementFormSchema = z.object({
  transitDate: z.string().min(1, "Transit date is required"),
  direction: z.enum(["IN", "OUT"]),
  shipmentId: z.string().nullable().optional(),
  remarks: z.string().optional(),
  items: z.array(z.union([truckSchema, containerSchema]))
    .min(1, "Add at least one item")
    .max(100, "Maximum of 100 items"),
});

export type TransitMovementFormValues =
  z.infer<typeof transitMovementFormSchema>;
