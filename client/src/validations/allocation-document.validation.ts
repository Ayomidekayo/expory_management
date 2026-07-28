import { z } from "zod";

export const createAllocationDocumentSchema =
  z.object({
    type: z.enum([
      "COMMERCIAL_INVOICE",
      "PACKING_LIST",
      "BILL_OF_LADING",
      "NXP",
      "XF",
      "CCI",
      "E_NUMBER",
      "INSURANCE",
      "INSPECTION_CERTIFICATE",
      "EXPORT_PERMIT",
      "CONTAINER_DOCUMENT",
      "TRANSIT_INVOICE",
      "OTHER",
    ]),

    remarks: z
      .string()
      .optional(),
  });

export type CreateAllocationDocumentDto =
  z.infer<
    typeof createAllocationDocumentSchema
  >;