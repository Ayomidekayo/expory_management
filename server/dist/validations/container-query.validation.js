"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerQueryDto = void 0;
const zod_1 = require("zod");
const container_validation_1 = require("./container.validation");
exports.ContainerQueryDto = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    search: zod_1.z.string().optional(),
    shipmentId: zod_1.z.string().optional(),
    packingListId: zod_1.z.string().optional(),
    status: zod_1.z
        .enum(container_validation_1.containerStatuses)
        .optional(),
    containerType: zod_1.z
        .enum(container_validation_1.containerTypes)
        .optional(),
    containerSize: zod_1.z
        .enum(container_validation_1.containerSizes)
        .optional(),
    sortBy: zod_1.z
        .enum([
        "createdAt",
        "containerNumber",
        "grossWeight",
        "status",
    ])
        .default("createdAt"),
    sortOrder: zod_1.z
        .enum(["asc", "desc"])
        .default("desc"),
});
