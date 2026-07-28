import { useClients } from "../client/useClients";
import { useExporters } from "../exporter/useExporters";
import { useConsignees } from "../consignee/useConsignees";

export function useAllocationLookups() {
  const clientsQuery = useClients();

  const exportersQuery = useExporters();

  const consigneesQuery = useConsignees();

  return {
    clients: clientsQuery.data?.data ?? [],

    exporters:
      exportersQuery.data?.data ?? [],

    consignees:
      consigneesQuery.data?.data ?? [],

    isLoading:
      clientsQuery.isLoading ||
      exportersQuery.isLoading ||
      consigneesQuery.isLoading,

    isError:
      clientsQuery.isError ||
      exportersQuery.isError ||
      consigneesQuery.isError,

    refetch: () => {
      clientsQuery.refetch();
      exportersQuery.refetch();
      consigneesQuery.refetch();
    },
  };
}