import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { generateShipment } from "../../api/allocation.api";
import { queryKeys } from "../../lib/queryKeys";


export const useGenerateShipment =
  () => {

    const queryClient =
      useQueryClient();

    return useMutation({

      mutationFn:
        generateShipment,

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey:
            queryKeys.allocations.all,
        });

        queryClient.invalidateQueries({
          queryKey:
            queryKeys.shipments.all,
        });

      },

    });

};