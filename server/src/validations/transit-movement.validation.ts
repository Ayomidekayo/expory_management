
import { z } from "zod";

/* =========================================
   SHARED HELPERS
========================================= */

const optionalText = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;

    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  },
  z.string().max(500).optional(),
);

const nullableShipmentId = z.preprocess(
  (value) => {
    if (value === "" || value === undefined) return value;
    if (value === null) return null;

    return typeof value === "string" ? value.trim() : value;
  },
  z.string().min(1).nullable().optional(),
);

const dateString = z
  .string()
  .trim()
  .min(1, "Date is required.")
  .refine(
    (value) => !Number.isNaN(new Date(value).getTime()),
    "Please provide a valid date.",
  );

const chargeAmount = z.coerce
  .number()
  .finite("Charge amount must be a valid number.")
  .min(0, "Charge amount cannot be negative.")
  .max(9999999999999999, "Charge amount is too large.");

const currencySchema = z.enum(["NGN", "USD", "EUR", "CFA"]);

/* =========================================
   COMMON ITEM FIELDS
========================================= */

const commonItemFields = {
  id: z.string().min(1).optional(),

  itemDate: dateString,

  name: optionalText,

  clientName: z
    .string()
    .trim()
    .min(2, "Client name must contain at least 2 characters.")
    .max(150, "Client name cannot exceed 150 characters."),

  chargeAmount: chargeAmount.default(0),

  chargeCurrency: currencySchema.default("NGN"),

  remarks: optionalText,
};

/* =========================================
   TRUCK ITEM
========================================= */

const truckItemSchema = z
  .object({
    ...commonItemFields,

    itemType: z.literal("TRUCK"),

    frontPlateNumber: optionalText,
    backPlateNumber: optionalText,

    // Accepted from forms, but not used for trucks.
    containerName: optionalText,
    containerNumber: optionalText,
  })
  .superRefine((item, ctx) => {
    if (!item.frontPlateNumber && !item.backPlateNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["frontPlateNumber"],
        message: "Provide at least one truck plate number.",
      });
    }
  });

/* =========================================
   CONTAINER ITEM
========================================= */

const containerItemSchema = z.object({
  ...commonItemFields,

  itemType: z.literal("CONTAINER"),

  containerName: z
    .string()
    .trim()
    .min(1, "Container name is required.")
    .max(100),

  containerNumber: z
    .string()
    .trim()
    .min(1, "Container number is required.")
    .max(50),

  // Accepted from forms, but not used for containers.
  frontPlateNumber: optionalText,
  backPlateNumber: optionalText,
});

/* =========================================
   TRANSIT ITEM
========================================= */

export const transitMovementItemSchema = z.discriminatedUnion(
  "itemType",
  [truckItemSchema, containerItemSchema],
);

/* =========================================
   CREATE TRANSIT MOVEMENT
========================================= */

export const createTransitMovementSchema = z.object({
  transitDate: dateString,

  direction: z.enum(["IN", "OUT"], {
    message: "Select Transit In or Transit Out.",
  }),

  shipmentId: nullableShipmentId,

  remarks: optionalText,

  items: z
    .array(transitMovementItemSchema)
    .min(1, "A Transit Movement must contain at least one item.")
    .max(100, "A maximum of 100 items is allowed per movement."),
});

/* =========================================
   UPDATE TRANSIT MOVEMENT
========================================= */

export const updateTransitMovementSchema = z.object({
  transitDate: dateString.optional(),

  // Direction is intentionally immutable after creation.
  shipmentId: nullableShipmentId,

  remarks: optionalText,

  items: z
    .array(transitMovementItemSchema)
    .min(1, "If items are supplied, at least one item is required.")
    .max(100, "A maximum of 100 items is allowed per movement.")
    .optional(),
});

/* =========================================
   EXPORTED DTO TYPES
========================================= */

export type CreateTransitMovementDto = z.infer<
  typeof createTransitMovementSchema
>;

export type UpdateTransitMovementDto = z.infer<
  typeof updateTransitMovementSchema
>;

export type TransitMovementItemDto = z.infer<
  typeof transitMovementItemSchema
>;




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
