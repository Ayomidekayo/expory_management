import { z } from "zod";

import {
  AllocationPriority,
  AllocationStatus,
  ServiceType,
  TransportMode,
} from "../generated";

/*
=====================================
Helpers
=====================================
*/

const optionalString = z.preprocess(
  (value) => {
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" &&
        value.trim() === "")
    ) {
      return undefined;
    }

    return value;
  },
  z.string().optional()
);

const optionalEnum = <
  T extends Record<string, string>
>(
  enumObject: T
) =>
  z.preprocess(
    (value) => {
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" &&
          value.trim() === "")
      ) {
        return undefined;
      }

      return value;
    },
    z.nativeEnum(enumObject).optional()
  );

/*
=====================================
Allocation Query
=====================================
*/

export const AllocationQueryDto = z
  .object({
    page: z.coerce
      .number()
      .int()
      .min(1)
      .default(1),

    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10),

    search: optionalString,

    status: optionalEnum(
      AllocationStatus
    ),

    priority: optionalEnum(
      AllocationPriority
    ),

    serviceType: optionalEnum(
      ServiceType
    ),

    transportMode: optionalEnum(
      TransportMode
    ),

    clientId: optionalString,

    exporterId: optionalString,

    consigneeId: optionalString,

    assignedToId: optionalString,

    createdById: optionalString,

    approvedById: optionalString,

    isActive: z.preprocess(
      (value) => {
        if (
          value === undefined ||
          value === null ||
          value === ""
        ) {
          return undefined;
        }

        if (value === "true") return true;

        if (value === "false") return false;

        return value;
      },
      z.boolean().optional()
    ),

    sortBy: z
      .enum([
        "createdAt",
        "updatedAt",
        "allocationNumber",
        "expectedShipmentDate",
        "priority",
        "status",
      ])
      .default("createdAt"),

    sortOrder: z
      .enum(["asc", "desc"])
      .default("desc"),
  })
  .strict();

export type AllocationQuery =
  z.infer<typeof AllocationQueryDto>;