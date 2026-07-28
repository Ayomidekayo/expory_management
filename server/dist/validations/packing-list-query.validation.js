"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackingListQueryDto = void 0;
const zod_1 = require("zod");
exports.PackingListQueryDto = zod_1.z.object({
    page: zod_1.z.coerce
        .number()
        .min(1)
        .default(1),
    limit: zod_1.z.coerce
        .number()
        .min(1)
        .max(100)
        .default(10),
    search: zod_1.z.string().optional(),
    shipmentId: zod_1.z.string().optional(),
    sortBy: zod_1.z
        .enum([
        "packingDate",
        "packingListNumber",
        "createdAt",
    ])
        .default("createdAt"),
    sortOrder: zod_1.z
        .enum(["asc", "desc"])
        .default("desc"),
});
