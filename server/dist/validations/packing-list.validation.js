"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackingListSchema = exports.createPackingListSchema = void 0;
const zod_1 = require("zod");
/* ===========================================
   HELPERS
=========================================== */
const optionalString = zod_1.z.preprocess((value) => (value === "" ? undefined : value), zod_1.z.string().optional());
const optionalNumber = zod_1.z.preprocess((value) => (value === "" ? undefined : value), zod_1.z.coerce.number().optional());
/* ===========================================
   PACKING ITEM
=========================================== */
const packingItemSchema = zod_1.z.object({
    description: zod_1.z
        .string()
        .min(1, "Description is required."),
    packageType: optionalString,
    packages: optionalNumber,
    grossWeight: optionalNumber,
    netWeight: optionalNumber,
    remarks: optionalString,
});
/* ===========================================
   CREATE
=========================================== */
exports.createPackingListSchema = zod_1.z.object({
    shipmentId: zod_1.z
        .string()
        .min(1, "Shipment is required."),
    packingDate: zod_1.z
        .string()
        .min(1, "Packing date is required."),
    packageType: optionalString,
    totalPackages: optionalNumber,
    grossWeight: zod_1.z.coerce.number(),
    netWeight: zod_1.z.coerce.number(),
    marksAndNumbers: optionalString,
    remarks: optionalString,
    items: zod_1.z
        .array(packingItemSchema)
        .min(1, "At least one packing item is required."),
});
/* ===========================================
   UPDATE
=========================================== */
exports.updatePackingListSchema = exports.createPackingListSchema.partial();
