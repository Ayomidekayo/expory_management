import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createGateMovement,
  deleteGateMovement,
  getGateMovement,
  getGateMovements,
  getGateStatistics,
  updateGateMovement,
  updateGateMovementStatus,
  type CreateGateMovementDto,
  type GateMovementFilters,
  type GateMovementStatus,
  type UpdateGateMovementDto,
} from "../../api/gate-movement.api";

/* =========================================
   GET ALL
========================================= */

export function useGateMovements(
  params?: GateMovementFilters
) {
  return useQuery({
    queryKey: [
      "gate-movements",
      params,
    ],

    queryFn: () =>
      getGateMovements(params),
  });
}

/* =========================================
   GET ONE
========================================= */

export function useGateMovement(
  id?: string
) {
  return useQuery({
    queryKey: [
      "gate-movement",
      id,
    ],

    queryFn: () =>
      getGateMovement(id!),

    enabled: Boolean(id),
  });
}

/* =========================================
   STATISTICS
========================================= */

export function useGateStatistics() {
  return useQuery({
    queryKey: [
      "gate-statistics",
    ],

    queryFn:
      getGateStatistics,
  });
}

/* =========================================
   CREATE
========================================= */

export function useCreateGateMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGateMovement,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["gate-movements"],
      });

      queryClient.invalidateQueries({
        queryKey: ["gate-statistics"],
      });
    },
  });
}

/* =========================================
   UPDATE
========================================= */

export function useUpdateGateMovement() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;

      payload: UpdateGateMovementDto;
    }) =>
      updateGateMovement({
        id,
        payload,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "gate-movements",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "gate-statistics",
        ],
      });
    },
  });
}

/* =========================================
   STATUS
========================================= */

export function useUpdateGateMovementStatus() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;

      status: GateMovementStatus;
    }) =>
      updateGateMovementStatus({
        id,
        status,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "gate-movements",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "gate-statistics",
        ],
      });
    },
  });
}

/* =========================================
   DELETE
========================================= */

export function useDeleteGateMovement() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      id: string
    ) =>
      deleteGateMovement(
        id
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "gate-movements",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "gate-statistics",
        ],
      });
    },
  });
}