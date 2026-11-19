
import type { z } from "zod";
import { createTransporterPaymentSchema, createTransporterSchema, transporterItemSchema, transporterQuerySchema, updateTransporterItemSchema, updateTransporterSchema } from "../validations/transporter.validation";
import { Prisma } from "../generated";



export type CreateTransporterDto = z.infer<
  typeof createTransporterSchema
>;

export type UpdateTransporterDto = z.infer<
  typeof updateTransporterSchema
>;

export type CreateTransporterItemDto = z.infer<
  typeof transporterItemSchema
>;

export type UpdateTransporterItemDto = z.infer<
  typeof updateTransporterItemSchema
>;

export type TransporterQuery = z.infer<
  typeof transporterQuerySchema
>;

export const transporterInclude = {
  shipment: {
    select: {
      id: true,
      shipmentNumber: true,
    },
  },

  items: {
    include: {
      payments: true,
    },

    orderBy: {
      itemDate: "asc",
    },
  },
} satisfies Prisma.TransporterInclude;

export type TransporterWithRelations =
  Prisma.TransporterGetPayload<{
    include: typeof transporterInclude;
  }>;

export interface TransporterPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TransporterListResult {
  data: TransporterWithRelations[];
  pagination: TransporterPagination;
}


export type CreateTransporterPaymentDto = z.infer<
  typeof createTransporterPaymentSchema
>;