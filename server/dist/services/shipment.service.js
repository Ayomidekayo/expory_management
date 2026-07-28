"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shipment_repository_1 = __importDefault(require("../Repository/shipment.repository"));
const allocation_repository_1 = __importDefault(require("../Repository/allocation.repository"));
const client_repository_1 = __importDefault(require("../Repository/client.repository"));
const exporter_repository_1 = __importDefault(require("../Repository/exporter.repository"));
const consignee_repository_1 = __importDefault(require("../Repository/consignee.repository"));
const ApiError_1 = require("../utils/ApiError");
class ShipmentService {
    /*
    =====================================
    Generate Shipment Number
    =====================================
    */
    async generateShipmentNumber() {
        const year = new Date().getFullYear();
        const latest = await shipment_repository_1.default.findLatestShipment();
        if (!latest) {
            return `SHP-${year}-00001`;
        }
        const sequence = Number(latest.shipmentNumber.split("-")[2]);
        return `SHP-${year}-${String(sequence + 1).padStart(5, "0")}`;
    }
    /*
    =====================================
    Create
    =====================================
    */
    async create(data, createdById) {
        // Verify Client
        const client = await client_repository_1.default.findById(data.clientId);
        if (!client) {
            throw new ApiError_1.ApiError(404, "Client not found.");
        }
        // Verify Exporter
        const exporter = await exporter_repository_1.default.findById(data.exporterId);
        if (!exporter) {
            throw new ApiError_1.ApiError(404, "Exporter not found.");
        }
        // Verify Consignee
        const consignee = await consignee_repository_1.default.findById(data.consigneeId);
        if (!consignee) {
            throw new ApiError_1.ApiError(404, "Consignee not found.");
        }
        // Verify Allocation
        if (data.allocationId) {
            const allocation = await allocation_repository_1.default.findById(data.allocationId);
            if (!allocation) {
                throw new ApiError_1.ApiError(404, "Allocation not found.");
            }
            const existingShipment = await shipment_repository_1.default.findByAllocationId(data.allocationId);
            if (existingShipment) {
                throw new Error("This allocation already has a shipment.");
            }
        }
        const shipmentNumber = await this.generateShipmentNumber();
        return shipment_repository_1.default.create({
            ...data,
            shipmentNumber,
            createdById,
        });
    }
    /*
    =====================================
    Find All
    =====================================
    */
    async findAll(query) {
        return shipment_repository_1.default.findAll(query);
    }
    /*
    =====================================
    Find One
    =====================================
    */
    async findById(id) {
        const shipment = await shipment_repository_1.default.findById(id);
        if (!shipment) {
            throw new ApiError_1.ApiError(404, "Shipment not found.");
        }
        return shipment;
    }
    /*
    =====================================
    Update
    =====================================
    */
    async update(id, data) {
        await this.findById(id);
        if (data.allocationId) {
            const allocation = await allocation_repository_1.default.findById(data.allocationId);
            if (!allocation) {
                throw new ApiError_1.ApiError(404, "Allocation not found.");
            }
            const existingShipment = await shipment_repository_1.default.findByAllocationId(data.allocationId);
            if (existingShipment &&
                existingShipment.id !== id) {
                throw new ApiError_1.ApiError(400, "Allocation already belongs to another shipment.");
            }
        }
        return shipment_repository_1.default.update(id, data);
    }
    /*
    =====================================
    Delete
    =====================================
    */
    async delete(id) {
        const shipment = await this.findById(id);
        if (shipment.invoice) {
            throw new ApiError_1.ApiError(400, "Cannot delete a shipment that already has an invoice.");
        }
        if (shipment.packingList) {
            throw new ApiError_1.ApiError(400, "Cannot delete a shipment that already has a packing list.");
        }
        if (shipment._count.containers > 0) {
            throw new ApiError_1.ApiError(400, "Cannot delete a shipment with containers.");
        }
        if (shipment._count.transits > 0) {
            throw new ApiError_1.ApiError(400, "Cannot delete a shipment with transit records.");
        }
        return shipment_repository_1.default.delete(id);
    }
    async findAvailable() {
        return shipment_repository_1.default.findAvailable();
    }
}
exports.default = new ShipmentService();
