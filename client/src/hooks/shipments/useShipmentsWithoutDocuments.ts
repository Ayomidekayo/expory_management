import { useQuery } from "@tanstack/react-query";


export function useShipmentsWithoutDocuments() {
  return useQuery({
    queryKey: [
      "shipments",
      "without-documents",
    ],

    queryFn:
      getShipmentsWithoutDocuments,
  });
}