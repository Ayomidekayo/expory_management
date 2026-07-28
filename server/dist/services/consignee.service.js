"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consignee_repository_1 = __importDefault(require("../Repository/consignee.repository"));
class ConsigneeService {
    async createConsignee(data) {
        if (data.email) {
            const existing = await consignee_repository_1.default.findByEmail(data.email);
            if (existing) {
                throw new Error("Consignee email already exists.");
            }
        }
        return consignee_repository_1.default.create(data);
    }
    async getConsignees() {
        return consignee_repository_1.default.findAll();
    }
    async getConsignee(id) {
        const consignee = await consignee_repository_1.default.findById(id);
        if (!consignee) {
            throw new Error("Consignee not found.");
        }
        return consignee;
    }
    async updateConsignee(id, data) {
        await this.getConsignee(id);
        return consignee_repository_1.default.update(id, data);
    }
    async deleteConsignee(id) {
        await this.getConsignee(id);
        return consignee_repository_1.default.delete(id);
    }
}
exports.default = new ConsigneeService();
