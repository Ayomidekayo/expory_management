
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getTransitMovements,
  getTransitMovement,
  getTransitMovementsByShipment,
  createTransitMovement,
  updateTransitMovement,
  deleteTransitMovement,
} from "../../api/transit-movement.api";

import type {
  TransitMovementQuery,
  CreateTransitMovementPayload,
  UpdateTransitMovementPayload,
} from "../../types/transit-movement";

export const transitMovementKeys = {
  all: ["transit-movements"] as const,

  lists: () =>
    [...transitMovementKeys.all, "list"] as const,

  list: (params?: TransitMovementQuery) =>
    [...transitMovementKeys.lists(), params] as const,

  details: () =>
    [...transitMovementKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...transitMovementKeys.details(), id] as const,

  byShipment: (shipmentId: string) =>
    [...transitMovementKeys.all, "shipment", shipmentId] as const,
};

// GET ALL
export function useTransitMovements(
  params?: TransitMovementQuery,
) {
  return useQuery({
    queryKey: transitMovementKeys.list(params),
    queryFn: () => getTransitMovements(params),
  });
}

// GET ONE
export function useTransitMovement(id: string) {
  return useQuery({
    queryKey: transitMovementKeys.detail(id),
    queryFn: () => getTransitMovement(id),
    enabled: Boolean(id),
  });
}

// GET BY SHIPMENT
export function useTransitMovementsByShipment(
  shipmentId: string,
) {
  return useQuery({
    queryKey: transitMovementKeys.byShipment(shipmentId),
    queryFn: () => getTransitMovementsByShipment(shipmentId),
    enabled: Boolean(shipmentId),
  });
}

// CREATE
export function useCreateTransitMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransitMovementPayload) =>
      createTransitMovement(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: transitMovementKeys.all,
      });
    },
  });
}

// UPDATE
export function useUpdateTransitMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTransitMovementPayload;
    }) => updateTransitMovement(id, payload),

    onSuccess: (updatedMovement) => {
      queryClient.invalidateQueries({
        queryKey: transitMovementKeys.all,
      });

      queryClient.setQueryData(
        transitMovementKeys.detail(updatedMovement.id),
        updatedMovement,
      );
    },
  });
}

// DELETE
export function useDeleteTransitMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTransitMovement(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: transitMovementKeys.all,
      });
    },
  });
}
