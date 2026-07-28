"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExporterSchema = exports.createExporterSchema = void 0;
const zod_1 = require("zod");
exports.createExporterSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(2, "Exporter name is required."),
    contactPerson: zod_1.z
        .string()
        .trim()
        .optional(),
    email: zod_1.z
        .string()
        .trim()
        .email("Invalid email address.")
        .optional()
        .or(zod_1.z.literal("")),
    phone: zod_1.z
        .string()
        .trim()
        .optional(),
    address: zod_1.z
        .string()
        .trim()
        .optional(),
});
exports.updateExporterSchema = exports.createExporterSchema.partial();
