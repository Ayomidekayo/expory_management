"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentQueryDto = void 0;
const zod_1 = require("zod");
const generated_1 = require("../generated");
exports.ShipmentQueryDto = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    search: zod_1.z.string().optional(),
    status: zod_1.z
        .nativeEnum(generated_1.ShipmentStatus)
        .optional(),
    transportMode: zod_1.z
        .nativeEnum(generated_1.TransportMode)
        .optional(),
    clientId: zod_1.z.string().optional(),
    exporterId: zod_1.z.string().optional(),
    consigneeId: zod_1.z.string().optional(),
    allocationId: zod_1.z.string().optional(),
    sortBy: zod_1.z
        .enum([
        "shipmentDate",
        "shipmentNumber",
        "createdAt",
    ])
        .default("createdAt"),
    sortOrder: zod_1.z
        .enum(["asc", "desc"])
        .default("desc"),
});
