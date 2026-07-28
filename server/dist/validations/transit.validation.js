"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransitSchema = exports.createTransitSchema = exports.transportModes = void 0;
const zod_1 = require("zod");
/* ===========================================
   ENUMS
=========================================== */
exports.transportModes = [
    "ROAD",
    "SEA",
    "AIR",
];
/* ===========================================
   HELPERS
=========================================== */
const optionalString = zod_1.z.preprocess((value) => (value === "" ? undefined : value), zod_1.z.string().optional());
const optionalNumber = zod_1.z.preprocess((value) => (value === "" ? undefined : value), zod_1.z.coerce.number().optional());
/* ===========================================
   CREATE
=========================================== */
exports.createTransitSchema = zod_1.z.object({
    shipmentId: zod_1.z
        .string()
        .min(1, "Shipment is required"),
    containerId: zod_1.z
        .string()
        .min(1, "Container is required"),
    origin: zod_1.z
        .string()
        .min(1, "Origin is required"),
    destination: zod_1.z
        .string()
        .min(1, "Destination is required"),
    transportMode: zod_1.z.enum(exports.transportModes),
    transporter: optionalString,
    transitInvoice: optionalString,
    agentNumber: optionalString,
    exporterNumber: optionalString,
    wibNumber: optionalString,
    quantity: optionalNumber,
    description: optionalString,
    unitPrice: optionalNumber,
    totalPrice: optionalNumber,
});
/* ===========================================
   UPDATE
=========================================== */
exports.updateTransitSchema = exports.createTransitSchema.partial();
