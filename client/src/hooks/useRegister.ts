import { useMutation } from "@tanstack/react-query";
import { register } from "../api/auth/auth.api";


export function useRegister() {
  return useMutation({
    mutationFn: register,
  });
}