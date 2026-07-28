import { useQuery } from "@tanstack/react-query";

import { getDocument } from "../../api/document.api";

export function useDocument(
  id: string
) {
  return useQuery({

    queryKey: [
      "document",
      id,
    ],

    queryFn: () =>
      getDocument(id),

    enabled: !!id,

  });
}