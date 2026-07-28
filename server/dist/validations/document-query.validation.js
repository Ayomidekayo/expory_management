"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentQueryDto = void 0;
const zod_1 = require("zod");
const generated_1 = require("../generated");
exports.DocumentQueryDto = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    search: zod_1.z.string().optional(),
    shipmentId: zod_1.z.string().optional(),
    containerId: zod_1.z.string().optional(),
    packingListId: zod_1.z.string().optional(),
    invoiceId: zod_1.z.string().optional(),
    transitId: zod_1.z.string().optional(),
    type: zod_1.z
        .nativeEnum(generated_1.DocumentType)
        .optional(),
    sortBy: zod_1.z
        .enum([
        "uploadedAt",
        "fileName",
        "type",
    ])
        .default("uploadedAt"),
    sortOrder: zod_1.z
        .enum([
        "asc",
        "desc",
    ])
        .default("desc"),
});
