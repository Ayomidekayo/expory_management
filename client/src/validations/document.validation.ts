import { z } from "zod";
import { DocumentType } from "../types/enums";

export const createDocumentSchema = z.object({
  shipmentId: z.string().min(1),

  type: z.nativeEnum(DocumentType),
attachTo: z.enum([
  "SHIPMENT",
  "CONTAINER",
  "PACKING_LIST",
  "TRANSIT",
  "INVOICE",
]),
  remarks: z.string().optional(),

  file: z.instanceof(File, {
    message: "Please select a file.",
  }),
});

export type CreateDocumentInput =
  z.infer<typeof createDocumentSchema>;