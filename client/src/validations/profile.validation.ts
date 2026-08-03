import { z } from "zod";

export const updateProfileSchema =
  z.object({

    name:
      z.string().min(2),

    phone:
      z.string().optional(),

    department:
      z.string().optional(),

    jobTitle:
      z.string().optional(),

    avatar:
      z.string().optional(),

  });

export type UpdateProfileInput =
  z.infer<
    typeof updateProfileSchema
  >;

export const changePasswordSchema =
  z
    .object({

      currentPassword:
        z.string().min(6),

      newPassword:
        z.string().min(6),

      confirmPassword:
        z.string().min(6),

    })
    .refine(
      (data) =>
        data.newPassword ===
        data.confirmPassword,
      {
        message:
          "Passwords do not match.",
        path: [
          "confirmPassword",
        ],
      }
    );

export type ChangePasswordInput =
  z.infer<
    typeof changePasswordSchema
  >;