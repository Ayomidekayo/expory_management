"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitQueryDto = void 0;
const zod_1 = require("zod");
const transit_validation_1 = require("./transit.validation");
exports.TransitQueryDto = zod_1.z.object({
    page: zod_1.z.coerce
        .number()
        .min(1)
        .default(1),
    limit: zod_1.z.coerce
        .number()
        .min(1)
        .max(100)
        .default(10),
    search: zod_1.z
        .string()
        .optional(),
    shipmentId: zod_1.z
        .string()
        .optional(),
    containerId: zod_1.z
        .string()
        .optional(),
    transportMode: zod_1.z
        .enum(transit_validation_1.transportModes)
        .optional(),
    sortBy: zod_1.z.enum([
        "createdAt",
        "origin",
        "destination",
        "transportMode",
        "quantity",
        "totalPrice",
    ])
        .default("createdAt"),
    sortOrder: zod_1.z.enum([
        "asc",
        "desc",
    ])
        .default("desc"),
});
