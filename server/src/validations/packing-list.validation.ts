import { z } from "zod";

/* ===========================================
   HELPERS
=========================================== */

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional()
);

const optionalNumber = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.number().optional()
);

/* ===========================================
   PACKING ITEM
=========================================== */

const packingItemSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required."),

  packageType: optionalString,

  packages: optionalNumber,

  grossWeight: optionalNumber,

  netWeight: optionalNumber,

  remarks: optionalString,
});

/* ===========================================
   CREATE
=========================================== */

export const createPackingListSchema =
  z.object({
    shipmentId: z
      .string()
      .min(1, "Shipment is required."),

    packingDate: z
      .string()
      .min(1, "Packing date is required."),

    packageType: optionalString,

    totalPackages: optionalNumber,

    grossWeight: z.coerce.number(),

    netWeight: z.coerce.number(),

    marksAndNumbers: optionalString,

    remarks: optionalString,

    items: z
      .array(packingItemSchema)
      .min(
        1,
        "At least one packing item is required."
      ),
  });

/* ===========================================
   UPDATE
=========================================== */

export const updatePackingListSchema =
  createPackingListSchema.partial();

/* ===========================================
   TYPES
=========================================== */

export type CreatePackingListDto =
  z.infer<
    typeof createPackingListSchema
  >;

export type UpdatePackingListDto =
  z.infer<
    typeof updatePackingListSchema
  >;