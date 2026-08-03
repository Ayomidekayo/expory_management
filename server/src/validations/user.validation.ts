import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required"),

  phone: z
    .string()
    .optional(),

  department: z
    .string()
    .optional(),

  jobTitle: z
    .string()
    .optional(),

  avatar: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
});
export const changePasswordSchema =
  z
    .object({
      currentPassword: z
        .string()
        .min(6),

      newPassword: z
        .string()
        .min(6),

      confirmPassword: z
        .string()
        .min(6),
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

export type ChangePasswordDto =
  z.infer<
    typeof changePasswordSchema
  >;
export type UpdateProfileDto =
  z.infer<typeof updateProfileSchema>;