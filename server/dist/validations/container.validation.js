"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContainerSchema = exports.createContainerSchema = exports.containerStatuses = exports.containerSizes = exports.containerTypes = void 0;
const zod_1 = require("zod");
/* ===========================================
   ENUMS
=========================================== */
exports.containerTypes = [
    "DRY",
    "REEFER",
    "OPEN_TOP",
    "FLAT_RACK",
    "TANK",
];
exports.containerSizes = [
    "FT20",
    "FT40",
    "FT45",
];
exports.containerStatuses = [
    "EMPTY",
    "LOADED",
    "IN_TRANSIT",
];
/* ===========================================
   HELPERS
=========================================== */
const optionalString = zod_1.z.preprocess((value) => (value === "" ? undefined : value), zod_1.z.string().optional());
const optionalNumber = zod_1.z.preprocess((value) => (value === "" ? undefined : value), zod_1.z.coerce.number().optional());
/* ===========================================
   CREATE
=========================================== */
exports.createContainerSchema = zod_1.z.object({
    shipmentId: zod_1.z.string().min(1, "Shipment is required"),
    packingListId: optionalString,
    containerNumber: zod_1.z
        .string()
        .min(1, "Container number is required"),
    sealNumber: optionalString,
    containerType: zod_1.z.enum(exports.containerTypes),
    containerSize: zod_1.z.enum(exports.containerSizes),
    grossWeight: optionalNumber,
    netWeight: optionalNumber,
    tareWeight: optionalNumber,
    volume: optionalNumber,
    loadingLocation: optionalString,
    destination: optionalString,
    status: zod_1.z
        .enum(exports.containerStatuses)
        .default("EMPTY"),
    shippingLine: optionalString,
    bookingReference: optionalString,
    containerCondition: optionalString,
});
/* ===========================================
   UPDATE
=========================================== */
exports.updateContainerSchema = exports.createContainerSchema.partial();
