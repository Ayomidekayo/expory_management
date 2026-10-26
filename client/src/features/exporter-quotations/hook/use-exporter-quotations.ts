import { useQuery } from "@tanstack/react-query";
import {
  getMySubmission,
  getMySubmissions,
} from "../api/exporter-quotations.api";

export function useMySubmissions() {
  return useQuery({
    queryKey: ["exporter", "quotations"],
    queryFn: getMySubmissions,
  });
}

export function useMySubmission(id: string) {
  return useQuery({
    queryKey: ["exporter", "quotations", id],
    queryFn: () => getMySubmission(id),
    enabled: Boolean(id),
  });
}