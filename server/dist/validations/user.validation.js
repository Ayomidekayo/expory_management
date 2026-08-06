"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name is required"),
    phone: zod_1.z
        .string()
        .optional(),
    department: zod_1.z
        .string()
        .optional(),
    jobTitle: zod_1.z
        .string()
        .optional(),
    avatar: zod_1.z
        .string()
        .url()
        .optional()
        .or(zod_1.z.literal(""))
});
exports.changePasswordSchema = zod_1.z
    .object({
    currentPassword: zod_1.z
        .string()
        .min(6),
    newPassword: zod_1.z
        .string()
        .min(6),
    confirmPassword: zod_1.z
        .string()
        .min(6),
})
    .refine((data) => data.newPassword ===
    data.confirmPassword, {
    message: "Passwords do not match.",
    path: [
        "confirmPassword",
    ],
});
