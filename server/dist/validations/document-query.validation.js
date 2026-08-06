"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentQueryDto = void 0;
const zod_1 = require("zod");
const generated_1 = require("../generated");
/*
=====================================
Helpers
=====================================
*/
const optionalString = zod_1.z.preprocess((value) => (value === "" ? undefined : value), zod_1.z.string().optional());
/*
=====================================
Document Query
=====================================
*/
exports.DocumentQueryDto = zod_1.z.object({
    page: zod_1.z.coerce
        .number()
        .min(1)
        .default(1),
    limit: zod_1.z.coerce
        .number()
        .min(1)
        .max(100)
        .default(10),
    search: optionalString,
    allocationId: optionalString,
    shipmentId: optionalString,
    containerId: optionalString,
    packingListId: optionalString,
    invoiceId: optionalString,
    transitId: optionalString,
    type: zod_1.z
        .preprocess((value) => (value === "" ? undefined : value), zod_1.z.nativeEnum(generated_1.DocumentType).optional()),
    sortBy: zod_1.z
        .enum([
        "uploadedAt",
        "updatedAt",
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
