import { z } from "zod";

import {
  AllocationPriority,
  AllocationStatus,
  ServiceType,
  TransportMode,
} from "../generated";

/*
=====================================
Optional Query String
=====================================

Converts:

""
→ undefined

This prevents empty filters from
causing 400 validation errors.
*/

const optionalString = z.preprocess(
  (value) => {
    if (
      typeof value === "string" &&
      value.trim() === ""
    ) {
      return undefined;
    }

    return value;
  },
  z.string().optional()
);

/*
=====================================
Optional Enum
=====================================
*/

const optionalEnum = <
  T extends Record<string, string>
>(
  enumObject: T
) =>
  z.preprocess(
    (value) => {
      if (
        typeof value === "string" &&
        value.trim() === ""
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

export const AllocationQueryDto = z.object({
  /*
  Pagination
  */

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

  /*
  Search
  */

  search: optionalString,

  /*
  Filters
  */

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

  /*
  Relations
  */

  clientId: optionalString,

  exporterId: optionalString,

  consigneeId: optionalString,

  assignedToId: optionalString,

  createdById: optionalString,

  approvedById: optionalString,

  /*
  Active Filter
  */

  isActive: z.preprocess(
    (value) => {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        return undefined;
      }

      if (value === "true") {
        return true;
      }

      if (value === "false") {
        return false;
      }

      return value;
    },
    z.boolean().optional()
  ),

  /*
  Sorting
  */

  sortBy: z.preprocess(
    (value) => {
      if (
        typeof value === "string" &&
        value.trim() === ""
      ) {
        return undefined;
      }

      return value;
    },
    z
      .enum([
        "createdAt",
        "updatedAt",
        "allocationNumber",
        "expectedShipmentDate",
        "priority",
        "status",
      ])
      .default("createdAt")
  ),

  sortOrder: z.preprocess(
    (value) => {
      if (
        typeof value === "string" &&
        value.trim() === ""
      ) {
        return undefined;
      }

      return value;
    },
    z
      .enum(["asc", "desc"])
      .default("desc")
  ),
});

export type AllocationQuery = z.infer<
  typeof AllocationQueryDto
>;