import { z } from "zod";
import { DocumentType } from "../generated";

/*
=====================================
Helpers
=====================================
*/

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional()
);

/*
=====================================
Base Schema
=====================================
*/

const documentSchema = z.object({

  type: z.nativeEnum(DocumentType),

  remarks: optionalString,

  allocationId: optionalString,

  shipmentId: optionalString,

  containerId: optionalString,

  packingListId: optionalString,

  invoiceId: optionalString,

  transitId: optionalString,

});

/*
=====================================
Create
=====================================
*/

export const createDocumentSchema =
  documentSchema.refine(
    (data) => {
      const ids = [
  data.allocationId,
  data.shipmentId,
  data.containerId,
  data.packingListId,
  data.invoiceId,
  data.transitId,
].filter(Boolean);

return ids.length === 1;
    },
    {
      message:
        "A document must belong to exactly one record.",
      path: ["shipmentId"],
    }
  );

/*
=====================================
Update
=====================================
*/

export const updateDocumentSchema =
  documentSchema
    .partial()
    .refine(
      (data) => {
        const ids = [
          data.shipmentId,
          data.containerId,
          data.packingListId,
          data.invoiceId,
          data.transitId,
        ].filter(Boolean);

        return ids.length <= 1;
      },
      {
        message:
          "A document can belong to only one record.",
        path: ["shipmentId"],
      }
    );

/*
=====================================
Types
=====================================
*/

export type CreateDocumentDto =
  z.infer<typeof createDocumentSchema>;

export type UpdateDocumentDto =
  z.infer<typeof updateDocumentSchema>;