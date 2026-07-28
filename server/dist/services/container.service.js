"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const container_repository_1 = __importDefault(require("../Repository/container.repository"));
const packing_list_repository_1 = __importDefault(require("../Repository/packing-list.repository"));
const shipment_repository_1 = __importDefault(require("../Repository/shipment.repository"));
class ContainerService {
    async generateContainerNumber() {
        const year = new Date().getFullYear();
        const latest = await container_repository_1.default.findLatestContainer();
        if (!latest) {
            return `CTR-${year}-00001`;
        }
        const sequence = Number(latest.containerNumber.split("-")[2]);
        return `CTR-${year}-${String(sequence + 1).padStart(5, "0")}`;
    }
    async create(data) {
        // Shipment must exist
        const shipment = await shipment_repository_1.default.findById(data.shipmentId);
        if (!shipment) {
            throw new Error("Shipment not found.");
        }
        // Packing List (Optional)
        if (data.packingListId) {
            const packingList = await packing_list_repository_1.default.findById(data.packingListId);
            if (!packingList) {
                throw new Error("Packing List not found.");
            }
            if (packingList.shipmentId !== data.shipmentId) {
                throw new Error("Packing List does not belong to the selected shipment.");
            }
        }
        // Auto Number
        // const containerNumber = await this.generateContainerNumber();
        // return containerRepository.create({
        //   ...data,
        //   containerNumber,
        // });
        const existing = await container_repository_1.default.findByContainerNumber(data.containerNumber);
        if (existing) {
            throw new Error("Container number already exists.");
        }
        return container_repository_1.default.create(data);
    }
    async findAll(query) {
        return container_repository_1.default.findAll(query);
    }
    async findById(id) {
        const container = await container_repository_1.default.findById(id);
        if (!container) {
            throw new Error("Container not found.");
        }
        return container;
    }
    async update(id, data) {
        await this.findById(id);
        if (data.shipmentId) {
            const shipment = await shipment_repository_1.default.findById(data.shipmentId);
            if (!shipment) {
                throw new Error("Shipment not found.");
            }
        }
        if (data.packingListId && data.shipmentId) {
            const packingList = await packing_list_repository_1.default.findById(data.packingListId);
            if (!packingList) {
                throw new Error("Packing List not found.");
            }
            if (packingList.shipmentId !== data.shipmentId) {
                throw new Error("Packing List does not belong to the selected shipment.");
            }
        }
        return container_repository_1.default.update(id, data);
    }
    async delete(id) {
        await this.findById(id);
        return container_repository_1.default.delete(id);
    }
}
exports.default = new ContainerService();
