import { useMutation } from "@tanstack/react-query";

import {
  registerExporter,
  type RegisterExporterDto,
} from "../api/auth/auth.api";

export function useRegisterExporter() {
  return useMutation({
    mutationFn: (data: RegisterExporterDto) =>
      registerExporter(data),
  });
}