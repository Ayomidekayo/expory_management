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
exports.createDocumentSchema = documentSchema.superRefine((data, ctx) => {
    const parentIds = [
        data.allocationId,
        data.shipmentId,
        data.containerId,
        data.packingListId,
        data.invoiceId,
        data.transitId,
    ].filter(Boolean);
    if (parentIds.length === 0) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "A document must belong to one record (Allocation, Shipment, Container, Packing List, Invoice or Transit).",
            path: ["allocationId"],
        });
    }
    if (parentIds.length > 1) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "A document can belong to only one record.",
            path: ["allocationId"],
        });
    }
});
/*
=====================================
Update
=====================================
*/
exports.updateDocumentSchema = documentSchema
    .partial()
    .superRefine((data, ctx) => {
    const parentIds = [
        data.allocationId,
        data.shipmentId,
        data.containerId,
        data.packingListId,
        data.invoiceId,
        data.transitId,
    ].filter(Boolean);
    if (parentIds.length > 1) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "A document can belong to only one record.",
            path: ["allocationId"],
        });
    }
});
