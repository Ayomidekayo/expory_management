"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClientSchema = exports.createClientSchema = void 0;
const zod_1 = require("zod");
exports.createClientSchema = zod_1.z.object({
    companyName: zod_1.z
        .string()
        .trim()
        .min(2, "Company name is required."),
    clientType: zod_1.z.enum([
        "COMPANY",
        "INDIVIDUAL",
    ]),
    contactPerson: zod_1.z
        .string()
        .trim()
        .optional(),
    email: zod_1.z
        .string()
        .email("Invalid email.")
        .optional()
        .or(zod_1.z.literal("")),
    phone: zod_1.z
        .string()
        .trim()
        .optional(),
    alternatePhone: zod_1.z
        .string()
        .trim()
        .optional(),
    address: zod_1.z
        .string()
        .trim()
        .optional(),
    city: zod_1.z
        .string()
        .trim()
        .optional(),
    state: zod_1.z
        .string()
        .trim()
        .optional(),
    country: zod_1.z
        .string()
        .trim()
        .optional(),
    website: zod_1.z
        .string()
        .url("Invalid website.")
        .optional()
        .or(zod_1.z.literal("")),
    taxNumber: zod_1.z
        .string()
        .trim()
        .optional(),
    remarks: zod_1.z
        .string()
        .trim()
        .optional(),
});
exports.updateClientSchema = exports.createClientSchema.partial();
