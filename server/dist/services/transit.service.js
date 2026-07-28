"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transit_repository_1 = __importDefault(require("../Repository/transit.repository"));
const shipment_repository_1 = __importDefault(require("../Repository/shipment.repository"));
const container_repository_1 = __importDefault(require("../Repository/container.repository"));
const ApiError_1 = require("../utils/ApiError");
class TransitService {
    /*
    =====================================
    Generate Transit Number
    =====================================
    */
    async generateTransitNumber() {
        const year = new Date().getFullYear();
        const latest = await transit_repository_1.default.findLatestTransit();
        if (!latest) {
            return `TRN-${year}-00001`;
        }
        const sequence = Number(latest.transitNumber.split("-")[2]);
        return `TRN-${year}-${String(sequence + 1).padStart(5, "0")}`;
    }
    /*
    =====================================
    Create
    =====================================
    */
    async create(data) {
        /*
        Shipment must exist
        */
        const shipment = await shipment_repository_1.default.findById(data.shipmentId);
        if (!shipment) {
            throw new ApiError_1.ApiError(404, "Shipment not found.");
        }
        const container = await container_repository_1.default.findById(data.containerId);
        if (!container) {
            throw new ApiError_1.ApiError(404, "Container not found.");
        }
        if (container.shipmentId !==
            data.shipmentId) {
            throw new ApiError_1.ApiError(400, "Selected container does not belong to the selected shipment.");
        }
        /*
        Auto Calculate Total Price
        */
        const totalPrice = data.quantity &&
            data.unitPrice
            ? Number(data.quantity) *
                Number(data.unitPrice)
            : undefined;
        /*
        Generate Transit Number
        */
        const transitNumber = await this.generateTransitNumber();
        return transit_repository_1.default.create({
            ...data,
            totalPrice,
            transitNumber,
        });
    }
    /*
    =====================================
    Find All
    =====================================
    */
    async findAll(query) {
        return transit_repository_1.default.findAll(query);
    }
    /*
    =====================================
    Find By Id
    =====================================
    */
    async findById(id) {
        const transit = await transit_repository_1.default.findById(id);
        if (!transit) {
            throw new ApiError_1.ApiError(404, "Transit not found.");
        }
        return transit;
    }
    /*
    =====================================
    Update
    =====================================
    */
    async update(id, data) {
        await this.findById(id);
        /*
        Validate Shipment
        */
        if (data.shipmentId) {
            const shipment = await shipment_repository_1.default.findById(data.shipmentId);
            if (!shipment) {
                throw new ApiError_1.ApiError(404, "Shipment not found.");
            }
        }
        /*
        Validate Container
        */
        if (data.containerId) {
            const container = await container_repository_1.default.findById(data.containerId);
            if (!container) {
                throw new ApiError_1.ApiError(404, "Container not found.");
            }
            if (data.shipmentId &&
                container.shipmentId !==
                    data.shipmentId) {
                throw new ApiError_1.ApiError(400, "Selected container does not belong to the selected shipment.");
            }
        }
        /*
        Auto Calculate Price
        */
        const payload = {
            ...data,
            totalPrice: data.quantity &&
                data.unitPrice
                ? Number(data.quantity) *
                    Number(data.unitPrice)
                : data.totalPrice,
        };
        return transit_repository_1.default.update(id, payload);
    }
    /*
    =====================================
    Delete
    =====================================
    */
    async delete(id) {
        await this.findById(id);
        return transit_repository_1.default.delete(id);
    }
}
exports.default = new TransitService();
