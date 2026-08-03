import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { updateProfile } from "../../api/user.api";

export function useUpdateProfile() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      toast.success(
        "Profile updated successfully."
      );
    },
  });
}