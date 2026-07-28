import { useQuery } from "@tanstack/react-query";

import { getDocuments } from "../../api/document.api";

import type {
  DocumentQuery,
} from "../../types/document";

export function useDocuments(
  params?: DocumentQuery
) {
  return useQuery({

    queryKey: [
      "documents",
      params,
    ],

    queryFn: () =>
      getDocuments(params),

  });
}