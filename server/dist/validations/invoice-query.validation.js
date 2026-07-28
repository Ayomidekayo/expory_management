"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceQueryDto = void 0;
const zod_1 = require("zod");
const optionalDate = zod_1.z.preprocess((value) => (value === "" ? undefined : value), zod_1.z.string().optional());
exports.InvoiceQueryDto = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    search: zod_1.z.string().optional(),
    status: zod_1.z
        .enum([
        "DRAFT",
        "SENT",
        "APPROVED",
        "PAID",
        "CANCELLED",
    ])
        .optional(),
    currency: zod_1.z
        .enum([
        "NGN",
        "USD",
        "EUR",
    ])
        .optional(),
    shipmentId: zod_1.z.string().optional(),
    // NEW
    fromDate: optionalDate,
    // NEW
    toDate: optionalDate,
    datePreset: zod_1.z
        .enum([
        "TODAY",
        "THIS_WEEK",
        "THIS_MONTH",
        "THIS_QUARTER",
        "THIS_YEAR",
    ])
        .optional(),
    sortBy: zod_1.z
        .enum([
        "invoiceDate",
        "createdAt",
        "invoiceNumber",
        "totalAmount",
    ])
        .default("createdAt"),
    sortOrder: zod_1.z
        .enum([
        "asc",
        "desc",
    ])
        .default("desc"),
});
