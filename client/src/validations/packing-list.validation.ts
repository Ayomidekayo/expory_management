import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional()
);

const optionalNumber = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.number().optional()
);

export const createPackingListSchema = z.object({
  shipmentId: z.string().min(1, "Shipment is required"),

  packingDate: z.string().min(1, "Packing date is required"),

  packageType: optionalString,

  totalPackages: optionalNumber,

  grossWeight: z.coerce.number(),

  netWeight: z.coerce.number(),

  marksAndNumbers: optionalString,

  remarks: optionalString,

  items: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),

      packageType: optionalString,

      packages: optionalNumber,

      grossWeight: optionalNumber,

      netWeight: optionalNumber,

      remarks: optionalString,
    })
  ),
});

export const updatePackingListSchema =
  createPackingListSchema.partial();

export type CreatePackingListInput =
  z.input<typeof createPackingListSchema>;

export type CreatePackingListOutput =
  z.output<typeof createPackingListSchema>;

export type UpdatePackingListInput =
  z.input<typeof updatePackingListSchema>;

export type UpdatePackingListOutput =
  z.output<typeof updatePackingListSchema>;