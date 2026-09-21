import { z } from "zod";

/* =========================================
   ENUMS
========================================= */

export const gateTypes = [
  "TERMINAL_GATE",
  "ECOWAS_GATE",
] as const;

export const gateMovementStatuses = [
  "PENDING",
  "CLEARED",
  "CROSSED",
  "CANCELLED",
] as const;

/* =========================================
   CREATE
========================================= */

export const createGateMovementSchema =
  z.object({
    /*
     * Existing container is optional
     * because manual container entry is allowed.
     */
    containerId: z
      .string()
      .optional(),

    containerNumber: z
      .string()
      .trim()
      .min(
        1,
        "Container number is required."
      ),

    yardStoreNumber: z
      .string()
      .trim()
      .optional(),

    truckFrontPlate: z
      .string()
      .trim()
      .min(
        1,
        "Truck front plate number is required."
      ),

    truckBackPlate: z
      .string()
      .trim()
      .min(
        1,
        "Truck back plate number is required."
      ),

    gateType: z.enum(gateTypes),

    status: z
      .enum(gateMovementStatuses)
      .optional(),

    notes: z
      .string()
      .trim()
      .optional(),
  });

/* =========================================
   UPDATE
========================================= */

export const updateGateMovementSchema =
  z.object({
    containerId: z
      .string()
      .optional(),

    containerNumber: z
      .string()
      .trim()
      .min(
        1,
        "Container number is required."
      ),

    yardStoreNumber: z
      .string()
      .trim()
      .optional(),

    truckFrontPlate: z
      .string()
      .trim()
      .min(
        1,
        "Truck front plate number is required."
      ),

    truckBackPlate: z
      .string()
      .trim()
      .min(
        1,
        "Truck back plate number is required."
      ),

    gateType: z.enum(gateTypes),

    status: z.enum(
      gateMovementStatuses
    ),

    notes: z
      .string()
      .trim()
      .optional(),
  });

/* =========================================
   STATUS UPDATE
========================================= */

export const updateGateStatusSchema =
  z.object({
    status: z.enum(
      gateMovementStatuses
    ),
  });

/* =========================================
   TYPES
========================================= */

export type CreateGateMovementDto =
  z.infer<
    typeof createGateMovementSchema
  >;

export type UpdateGateMovementDto =
  z.infer<
    typeof updateGateMovementSchema
  >;