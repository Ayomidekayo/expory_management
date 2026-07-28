"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInvoiceSchema = exports.createInvoiceSchema = exports.paymentTerms = exports.invoiceStatus = exports.currencies = void 0;
const zod_1 = require("zod");
/* ===========================================
   ENUMS
=========================================== */
exports.currencies = [
    "NGN",
    "USD",
    "EUR",
];
exports.invoiceStatus = [
    "DRAFT",
    "SENT",
    "APPROVED",
    "PAID",
    "CANCELLED",
];
exports.paymentTerms = [
    "CASH",
    "ADVANCE",
    "COD",
    "NET_15",
    "NET_30",
    "NET_60",
    "LETTER_OF_CREDIT",
];
/* ===========================================
   HELPERS
=========================================== */
const optionalString = zod_1.z.preprocess((value) => (value === "" ? undefined : value), zod_1.z.string().optional());
const optionalNumber = zod_1.z.preprocess((value) => (value === "" ? undefined : value), zod_1.z.coerce.number().optional());
/* ===========================================
   CREATE
=========================================== */
exports.createInvoiceSchema = zod_1.z.object({
    shipmentId: zod_1.z.string().min(1),
    invoiceDate: zod_1.z.string().min(1),
    currency: zod_1.z.enum(exports.currencies),
    exchangeRate: optionalNumber,
    paymentTerms: zod_1.z
        .enum(exports.paymentTerms)
        .optional(),
    status: zod_1.z
        .enum(exports.invoiceStatus)
        .default("DRAFT"),
    incoterm: optionalString,
    commercialReference: optionalString,
    transportUnits: optionalNumber,
    freight: zod_1.z.coerce.number(),
    remarks: optionalString,
    // ✅ ADD THIS
    items: zod_1.z
        .array(zod_1.z.object({
        description: zod_1.z.string().min(1),
        hsCode: optionalString,
        packageType: optionalString,
        packages: optionalNumber,
        grossWeight: optionalNumber,
        netWeight: optionalNumber,
        quantity: zod_1.z.coerce.number(),
        unit: optionalString,
        unitPrice: zod_1.z.coerce.number(),
        remarks: optionalString,
    }))
        .min(1, "At least one invoice item is required."),
});
exports.updateInvoiceSchema = exports.createInvoiceSchema.partial();
