"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllocationQueryDto = void 0;
const zod_1 = require("zod");
const generated_1 = require("../generated");
exports.AllocationQueryDto = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    search: zod_1.z.string().optional(),
    status: zod_1.z
        .nativeEnum(generated_1.AllocationStatus)
        .optional(),
    priority: zod_1.z
        .nativeEnum(generated_1.AllocationPriority)
        .optional(),
    serviceType: zod_1.z
        .nativeEnum(generated_1.ServiceType)
        .optional(),
    transportMode: zod_1.z
        .nativeEnum(generated_1.TransportMode)
        .optional(),
    clientId: zod_1.z.string().optional(),
    exporterId: zod_1.z.string().optional(),
    consigneeId: zod_1.z.string().optional(),
    assignedToId: zod_1.z.string().optional(),
    createdById: zod_1.z.string().optional(),
    approvedById: zod_1.z.string().optional(),
    isActive: zod_1.z.coerce.boolean().optional(),
    sortBy: zod_1.z
        .enum([
        "createdAt",
        "updatedAt",
        "allocationNumber",
        "expectedShipmentDate",
        "priority",
        "status",
    ])
        .default("createdAt"),
    sortOrder: zod_1.z
        .enum(["asc", "desc"])
        .default("desc"),
});
