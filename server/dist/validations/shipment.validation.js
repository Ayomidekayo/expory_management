"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShipmentSchema = exports.createShipmentSchema = void 0;
const zod_1 = require("zod");
const generated_1 = require("../generated");
const optionalDate = zod_1.z.preprocess((value) => (value === "" ? undefined : value), zod_1.z.string().optional());
exports.createShipmentSchema = zod_1.z.object({
    shipmentDate: zod_1.z.string(),
    xfNumber: zod_1.z.string().optional(),
    nxpNumber: zod_1.z.string().optional(),
    cciNumber: zod_1.z.string().optional(),
    eNumber: zod_1.z.string().optional(),
    bookingNumber: zod_1.z.string().optional(),
    transportMode: zod_1.z.nativeEnum(generated_1.TransportMode),
    shippingLine: zod_1.z.string().optional(),
    vesselName: zod_1.z.string().optional(),
    voyageNumber: zod_1.z.string().optional(),
    portOfLoading: zod_1.z.string().optional(),
    portOfDischarge: zod_1.z.string().optional(),
    expectedDeparture: optionalDate,
    expectedArrival: optionalDate,
    actualDeparture: optionalDate,
    actualArrival: optionalDate,
    remarks: zod_1.z.string().optional(),
    status: zod_1.z
        .nativeEnum(generated_1.ShipmentStatus)
        .optional(),
    clientId: zod_1.z.string().min(1),
    exporterId: zod_1.z.string().min(1),
    consigneeId: zod_1.z.string().min(1),
    allocationId: zod_1.z.string().optional(),
});
exports.updateShipmentSchema = exports.createShipmentSchema.partial();
