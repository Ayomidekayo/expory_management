import { z } from "zod";
import { DocumentType } from "../generated";

export const createAllocationDocumentSchema = z.object({
  type: z.nativeEnum(DocumentType),

  remarks: z.string().optional(),
});

export type CreateAllocationDocumentDto =
  z.infer<typeof createAllocationDocumentSchema>;