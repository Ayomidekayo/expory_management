import { useQuery } from "@tanstack/react-query";
import { getDocument } from "../../api/document.api";

export function useDocument(id: string) {
  return useQuery({
    queryKey: ["document", id],

    queryFn: async () => {
      const response = await getDocument(id);
      return response.data; // <-- Return the Document, not the wrapper
    },

    enabled: !!id,
  });
}