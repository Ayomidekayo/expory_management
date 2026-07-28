"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allocation_repository_1 = __importDefault(require("../Repository/allocation.repository"));
const consignee_repository_1 = __importDefault(require("../Repository/consignee.repository"));
const exporter_repository_1 = __importDefault(require("../Repository/exporter.repository"));
const client_repository_1 = __importDefault(require("../Repository/client.repository"));
class AllocationService {
    /*
    =====================================
    Generate Allocation Number
    =====================================
    */
    async generateAllocationNumber() {
        const year = new Date().getFullYear();
        const latest = await allocation_repository_1.default.findLatestAllocation();
        if (!latest) {
            return `AL-${year}-00001`;
        }
        const sequence = Number(latest.allocationNumber.split("-")[2]);
        return `AL-${year}-${String(sequence + 1).padStart(5, "0")}`;
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
            throw new Error("Client not found.");
        }
        // Verify Exporter
        if (data.exporterId) {
            const exporter = await exporter_repository_1.default.findById(data.exporterId);
            if (!exporter) {
                throw new Error("Exporter not found.");
            }
        }
        // Verify Consignee
        if (data.consigneeId) {
            const consignee = await consignee_repository_1.default.findById(data.consigneeId);
            if (!consignee) {
                throw new Error("Consignee not found.");
            }
        }
        const allocationNumber = await this.generateAllocationNumber();
        return allocation_repository_1.default.create({
            ...data,
            allocationNumber,
            createdById,
        });
    }
    /*
    =====================================
    Find All
    =====================================
    */
    async findAll(query) {
        return allocation_repository_1.default.findAll(query);
    }
    /*
    =====================================
    Find By Id
    =====================================
    */
    async findById(id) {
        const allocation = await allocation_repository_1.default.findById(id);
        if (!allocation) {
            throw new Error("Allocation not found.");
        }
        return allocation;
    }
    /*
    =====================================
    Update
    =====================================
    */
    async update(id, data) {
        await this.findById(id);
        return allocation_repository_1.default.update(id, data);
    }
    /*
    =====================================
    Delete
    =====================================
    */
    async delete(id) {
        const allocation = await this.findById(id);
        if (allocation.shipment) {
            throw new Error("Cannot delete an allocation that already has a shipment.");
        }
        return allocation_repository_1.default.delete(id);
    }
    async updateStatus(id, status) {
        await this.findById(id);
        return allocation_repository_1.default.updateStatus(id, status);
    }
}
exports.default = new AllocationService();
