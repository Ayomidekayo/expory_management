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
  documentSchema.superRefine((data, ctx) => {
    const parentIds = [
      data.allocationId,
      data.shipmentId,
      data.containerId,
      data.packingListId,
      data.invoiceId,
      data.transitId,
    ].filter(Boolean);

    if (parentIds.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "A document must belong to one record (Allocation, Shipment, Container, Packing List, Invoice or Transit).",
        path: ["allocationId"],
      });
    }

    if (parentIds.length > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "A document can belong to only one record.",
        path: ["allocationId"],
      });
    }
  });

/*
=====================================
Update
=====================================
*/

export const updateDocumentSchema =
  documentSchema
    .partial()
    .superRefine((data, ctx) => {
      const parentIds = [
        data.allocationId,
        data.shipmentId,
        data.containerId,
        data.packingListId,
        data.invoiceId,
        data.transitId,
      ].filter(Boolean);

      if (parentIds.length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "A document can belong to only one record.",
          path: ["allocationId"],
        });
      }
    });

/*
=====================================
Types
=====================================
*/

export type CreateDocumentDto =
  z.infer<typeof createDocumentSchema>;

export type UpdateDocumentDto =
  z.infer<typeof updateDocumentSchema>;