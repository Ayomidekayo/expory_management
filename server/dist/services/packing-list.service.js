"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const packing_list_repository_1 = __importDefault(require("../Repository/packing-list.repository"));
const shipment_repository_1 = __importDefault(require("../Repository/shipment.repository"));
const ApiError_1 = require("../utils/ApiError");
class PackingListService {
    /*
    =====================================
    Generate Packing List Number
    =====================================
    */
    async generatePackingListNumber() {
        const year = new Date().getFullYear();
        const latest = await packing_list_repository_1.default.findLatestPackingList();
        if (!latest) {
            return `PKL-${year}-00001`;
        }
        const sequence = Number(latest.packingListNumber.split("-")[2]);
        return `PKL-${year}-${String(sequence + 1).padStart(5, "0")}`;
    }
    /*
    =====================================
    Create
    =====================================
    */
    async create(data) {
        const shipment = await shipment_repository_1.default.findById(data.shipmentId);
        if (!shipment) {
            throw new ApiError_1.ApiError(404, "Shipment not found.");
        }
        const existing = await packing_list_repository_1.default.findByShipmentId(data.shipmentId);
        if (existing) {
            throw new ApiError_1.ApiError(400, "This shipment already has a packing list.");
        }
        const packingListNumber = await this.generatePackingListNumber();
        return packing_list_repository_1.default.create({
            ...data,
            packingListNumber,
        });
    }
    /*
    =====================================
    Find All
    =====================================
    */
    async findAll(query) {
        return packing_list_repository_1.default.findAll(query);
    }
    /*
    =====================================
    Find By Id
    =====================================
    */
    async findById(id) {
        const packingList = await packing_list_repository_1.default.findById(id);
        if (!packingList) {
            throw new ApiError_1.ApiError(404, "Packing list not found.");
        }
        return packingList;
    }
    /*
    =====================================
    Update
    =====================================
    */
    async update(id, data) {
        await this.findById(id);
        return packing_list_repository_1.default.update(id, data);
    }
    /*
    =====================================
    Delete
    =====================================
    */
    async delete(id) {
        await this.findById(id);
        return packing_list_repository_1.default.delete(id);
    }
}
exports.default = new PackingListService();
