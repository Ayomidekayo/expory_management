"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConsigneeSchema = exports.createConsigneeSchema = void 0;
const zod_1 = require("zod");
exports.createConsigneeSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(2, "Consignee name is required."),
    contactPerson: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    email: zod_1.z
        .string()
        .email("Invalid email address.")
        .optional()
        .or(zod_1.z.literal("")),
    transporter: zod_1.z.string().optional(),
    placeOfLoading: zod_1.z
        .string()
        .min(1, "Place of loading is required."),
    transitRoute: zod_1.z
        .string()
        .min(1, "Transit route is required."),
    portOfDischarge: zod_1.z
        .string()
        .min(1, "Port of discharge is required."),
    transportMode: zod_1.z.enum([
        "ROAD",
        "SEA",
        "AIR",
        "RAIL",
    ]),
});
exports.updateConsigneeSchema = exports.createConsigneeSchema.partial();
