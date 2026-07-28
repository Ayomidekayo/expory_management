"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDocumentSchema = exports.createDocumentSchema = void 0;
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
Base Schema
=====================================
*/
const documentSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(generated_1.DocumentType),
    remarks: optionalString,
    allocationId: optionalString,
    shipmentId: optionalString,
    containerId: optionalString,
    packingListId: optionalString,
    invoiceId: optionalString,
    transitId: optionalString,
});
/*
=====================================
Create
=====================================
*/
exports.createDocumentSchema = documentSchema.refine((data) => {
    const ids = [
        data.allocationId,
        data.shipmentId,
        data.containerId,
        data.packingListId,
        data.invoiceId,
        data.transitId,
    ].filter(Boolean);
    return ids.length === 1;
}, {
    message: "A document must belong to exactly one record.",
    path: ["shipmentId"],
});
/*
=====================================
Update
=====================================
*/
exports.updateDocumentSchema = documentSchema
    .partial()
    .refine((data) => {
    const ids = [
        data.shipmentId,
        data.containerId,
        data.packingListId,
        data.invoiceId,
        data.transitId,
    ].filter(Boolean);
    return ids.length <= 1;
}, {
    message: "A document can belong to only one record.",
    path: ["shipmentId"],
});
