import z from "zod";
import { DocumentType } from "../types";


export const createDocumentSchema = z.object({
  type: z.nativeEnum(DocumentType),

  attachTo: z.enum([
    "SHIPMENT",
    "ALLOCATION",
    "CONTAINER",
    "PACKING_LIST",
    "TRANSIT",
    "INVOICE",
  ]),

  shipmentId: z.string().optional(),

  allocationId: z.string().optional(),

  containerId: z.string().optional(),

  packingListId: z.string().optional(),

  invoiceId: z.string().optional(),

  transitId: z.string().optional(),

  remarks: z.string().optional(),

  file: z.instanceof(File, {
    message: "Please select a file.",
  }),
});

export type CreateDocumentInput =
  z.infer<typeof createDocumentSchema>;

export const updateDocumentSchema =
  createDocumentSchema.partial();

export type UpdateDocumentInput =
  z.infer<typeof updateDocumentSchema>;