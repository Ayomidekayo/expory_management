import {
  useMutation,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { changePassword } from "../../api/user.api";

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,

    onSuccess() {
      toast.success(
        "Password updated successfully."
      );
    },
  });
}