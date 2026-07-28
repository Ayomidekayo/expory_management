"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllocationSchema = exports.createAllocationSchema = void 0;
const zod_1 = require("zod");
const generated_1 = require("../generated");
exports.createAllocationSchema = zod_1.z.object({
    // Client Information
    clientId: zod_1.z.string().min(1, "Client is required."),
    exporterId: zod_1.z.string().optional(),
    consigneeId: zod_1.z.string().optional(),
    // Service
    serviceType: zod_1.z.nativeEnum(generated_1.ServiceType),
    priority: zod_1.z
        .nativeEnum(generated_1.AllocationPriority)
        .default(generated_1.AllocationPriority.MEDIUM),
    status: zod_1.z
        .nativeEnum(generated_1.AllocationStatus)
        .default(generated_1.AllocationStatus.PENDING),
    // Cargo
    cargoDescription: zod_1.z
        .string()
        .min(1, "Cargo description is required."),
    cargoType: zod_1.z.string().optional(),
    commodityCode: zod_1.z.string().optional(),
    commodityName: zod_1.z.string().optional(),
    quantity: zod_1.z.coerce.number().optional(),
    packageType: zod_1.z.string().optional(),
    numberOfPackages: zod_1.z.coerce.number().optional(),
    grossWeight: zod_1.z.coerce.number().optional(),
    netWeight: zod_1.z.coerce.number().optional(),
    volume: zod_1.z.coerce.number().optional(),
    // Shipping
    originCountry: zod_1.z.string().optional(),
    originCity: zod_1.z.string().optional(),
    pickupAddress: zod_1.z.string().optional(),
    pickupDate: zod_1.z.preprocess((value) => (value === "" ? undefined : value), zod_1.z.string().optional()),
    destinationCountry: zod_1.z
        .string()
        .min(1, "Destination country is required."),
    destinationCity: zod_1.z.string().optional(),
    destinationPort: zod_1.z.string().optional(),
    portOfLoading: zod_1.z.string().optional(),
    portOfDischarge: zod_1.z.string().optional(),
    transportMode: zod_1.z
        .nativeEnum(generated_1.TransportMode)
        .optional(),
    shippingLine: zod_1.z.string().optional(),
    incoterm: zod_1.z.string().optional(),
    deliveryAddress: zod_1.z.string().optional(),
    expectedShipmentDate: zod_1.z.preprocess((value) => (value === "" ? undefined : value), zod_1.z.string().datetime().optional()),
    // Finance
    estimatedValue: zod_1.z.coerce.number().optional(),
    currency: zod_1.z.string().optional(),
    paymentTerms: zod_1.z.string().optional(),
    freightType: zod_1.z.string().optional(),
    insuranceRequired: zod_1.z
        .boolean()
        .default(false),
    // Remarks
    specialInstruction: zod_1.z.string().optional(),
    internalRemark: zod_1.z.string().optional(),
});
exports.updateAllocationSchema = exports.createAllocationSchema.partial();
