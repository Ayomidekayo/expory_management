import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addTransporterItem,
  createTransporter,
  createTransporterPayment,
  deleteTransporter,
  deleteTransporterItem,
  getTransporter,
  getTransporterItemPayments,
  getTransporters,
  updateTransporter,
  updateTransporterItem,
} from "../../api/transporter.api";

import type {
  CreateTransporterPayload,
  TransporterPaymentPayload,
  TransporterQuery,
  UpdateTransporterItemPayload,
  UpdateTransporterPayload,
  TransporterItemInput,
} from "../../types/transporter";

export const transporterKeys = {
  all: ["transporters"] as const,
  lists: () => [...transporterKeys.all, "list"] as const,
  list: (query: TransporterQuery) => [...transporterKeys.lists(), query] as const,
  details: () => [...transporterKeys.all, "detail"] as const,
  detail: (id: string) => [...transporterKeys.details(), id] as const,
  payments: (id: string, itemId: string) =>
    [...transporterKeys.detail(id), "items", itemId, "payments"] as const,
};

export function useTransporters(query: TransporterQuery) {
  return useQuery({
    queryKey: transporterKeys.list(query),
    queryFn: () => getTransporters(query),
    placeholderData: (previous) => previous,
  });
}

export function useTransporter(id: string) {
  return useQuery({
    queryKey: transporterKeys.detail(id),
    queryFn: () => getTransporter(id),
    enabled: Boolean(id),
  });
}

export function useCreateTransporter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTransporterPayload) => createTransporter(payload),
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: transporterKeys.all });
      queryClient.setQueryData(transporterKeys.detail(created.id), created);
    },
  });
}

export function useUpdateTransporter(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTransporterPayload) => updateTransporter(id, payload),
    onSuccess: async (updated) => {
      queryClient.setQueryData(transporterKeys.detail(id), updated);
      await queryClient.invalidateQueries({ queryKey: transporterKeys.all });
    },
  });
}

export function useDeleteTransporter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTransporter(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: transporterKeys.all });
    },
  });
}

export function useAddTransporterItem(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TransporterItemInput) => addTransporterItem(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: transporterKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: transporterKeys.lists() });
    },
  });
}

export function useUpdateTransporterItem(id: string, itemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTransporterItemPayload) =>
      updateTransporterItem(id, itemId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: transporterKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: transporterKeys.lists() });
    },
  });
}

export function useDeleteTransporterItem(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => deleteTransporterItem(id, itemId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: transporterKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: transporterKeys.lists() });
    },
  });
}

export function useTransporterItemPayments(id: string, itemId: string, enabled = true) {
  return useQuery({
    queryKey: transporterKeys.payments(id, itemId),
    queryFn: () => getTransporterItemPayments(id, itemId),
    enabled: Boolean(id && itemId && enabled),
  });
}

export function useCreateTransporterPayment(id: string, itemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TransporterPaymentPayload) =>
      createTransporterPayment(id, itemId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: transporterKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: transporterKeys.payments(id, itemId) });
      await queryClient.invalidateQueries({ queryKey: transporterKeys.lists() });
    },
  });
}
