import { z } from "zod";
import { Currency, ItemPaymentType, PaymentStatus, TransporterStatus, TransportItemType } from "../generated";



export const transporterItemSchema = z.object({
  itemDate: z.coerce.date(),

  itemType: z.nativeEnum(TransportItemType),

  name: z.string().trim().optional().nullable(),

  frontPlateNumber: z.string().trim().optional().nullable(),

  backPlateNumber: z.string().trim().optional().nullable(),

  containerName: z.string().trim().optional().nullable(),

  containerNumber: z.string().trim().optional().nullable(),

  status: z.nativeEnum(TransporterStatus).default(
    TransporterStatus.PENDING
  ),

  chargeAmount: z.coerce.number().min(0).default(0),

  chargeCurrency: z.nativeEnum(Currency).default(Currency.NGN),

  paymentStatus: z.nativeEnum(PaymentStatus).default(
    PaymentStatus.UNPAID
  ),

  remarks: z.string().trim().optional().nullable(),
});

export const createTransporterSchema = z.object({
  transportDate: z.coerce.date(),

  truckOwnerName: z
    .string()
    .trim()
    .min(1, "Truck owner name is required.")
    .max(150),

  shipmentId: z.string().trim().nullable().optional(),

  remarks: z.string().trim().nullable().optional(),

  items: z
    .array(transporterItemSchema)
    .min(1, "Add at least one truck or container item."),
});

export const updateTransporterSchema = z
  .object({
    transportNumber: z.string().trim().min(1).max(50).optional(),

    transportDate: z.coerce.date().optional(),

    truckOwnerName: z.string().trim().min(1).max(150).optional(),

    shipmentId: z.string().trim().nullable().optional(),

    remarks: z.string().trim().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  });

export const updateTransporterItemSchema = z
  .object({
    itemDate: z.coerce.date().optional(),

    itemType: z.nativeEnum(TransportItemType).optional(),

    name: z.string().trim().nullable().optional(),

    frontPlateNumber: z.string().trim().nullable().optional(),

    backPlateNumber: z.string().trim().nullable().optional(),

    containerName: z.string().trim().nullable().optional(),

    containerNumber: z.string().trim().nullable().optional(),

    status: z.nativeEnum(TransporterStatus).optional(),

    chargeAmount: z.coerce.number().min(0).optional(),

    chargeCurrency: z.nativeEnum(Currency).optional(),

    paymentStatus: z.nativeEnum(PaymentStatus).optional(),

    remarks: z.string().trim().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  });

export const transporterQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().optional(),

  shipmentId: z.string().trim().optional(),

  status: z.nativeEnum(TransporterStatus).optional(),

  itemType: z.nativeEnum(TransportItemType).optional(),

  sortBy: z
    .enum(["transportDate", "transportNumber", "createdAt"])
    .default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const transporterIdSchema = z.object({
  id: z.string().trim().min(1),
});

export const transporterItemParamsSchema = z.object({
  id: z.string().trim().min(1),
  itemId: z.string().trim().min(1),
});


export const createTransporterPaymentSchema = z.object({
  amount: z.coerce.number().positive(
    "Payment amount must be greater than zero."
  ),

  paymentType: z.nativeEnum(ItemPaymentType),

  paymentDate: z.coerce.date().optional(),

  paymentMethod: z.string().trim().max(100).optional().nullable(),

  reference: z.string().trim().max(100).optional().nullable(),

  description: z.string().trim().max(500).optional().nullable(),

  notes: z.string().trim().max(1000).optional().nullable(),
});

