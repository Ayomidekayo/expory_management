import { z } from "zod";

const optionalString = z.preprocess(
  value => value === "" ? undefined : value,
  z.string().optional()
);

const optionalNumber = z.preprocess(
  value => value === "" ? undefined : value,
  z.coerce.number().optional()
);

export const createPackingListSchema =
  z.object({

    shipmentId: z.string().min(1),

    packingDate: z.string().min(1),

    packageType: optionalString,

    totalPackages: optionalNumber,

    grossWeight: z.coerce.number(),

    netWeight: z.coerce.number(),

    marksAndNumbers:
      optionalString,

    remarks:
      optionalString,

    items: z.array(

      z.object({

        description:
          z.string().min(1),

        packageType:
          optionalString,

        packages:
          optionalNumber,

        grossWeight:
          optionalNumber,

        netWeight:
          optionalNumber,

        remarks:
          optionalString,

      })

    ),

  });

export const updatePackingListSchema =
  createPackingListSchema.partial();

export type CreatePackingListInput =
  z.infer<
    typeof createPackingListSchema
  >;

export type UpdatePackingListInput =
  z.infer<
    typeof updatePackingListSchema
  >;