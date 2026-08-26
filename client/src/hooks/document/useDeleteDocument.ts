import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDocument } from "../../api/document.api";

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
      queryClient.invalidateQueries({
        queryKey: ["invoice"],
      });

      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      queryClient.invalidateQueries({
        queryKey: ["allocation"],
      });

      

queryClient.invalidateQueries({
        queryKey: ["alllocations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["shipment"],
      });

      queryClient.invalidateQueries({
        queryKey: ["shipments"],
      });
      

       queryClient.invalidateQueries({
        queryKey: ["packingList"],
      });
      queryClient.invalidateQueries({
        queryKey: ["packingLists"],
      });

      queryClient.invalidateQueries({
        queryKey: ["container"],
      });

      queryClient.invalidateQueries({
        queryKey: ["containers"],
      });
       queryClient.invalidateQueries({
        queryKey: ["transit"],
      });
      queryClient.invalidateQueries({
        queryKey: ["transits"],
      });

      queryClient.invalidateQueries({
        queryKey: ["exporter"],
      });

      queryClient.invalidateQueries({
        queryKey: ["exporters"],
      });
    },
  });
}