"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const allocation_document_repository_1 = __importDefault(require("../Repository/allocation-document.repository"));
class AllocationDocumentService {
    async create(data) {
        return allocation_document_repository_1.default.create(data);
    }
    async list(allocationId) {
        return allocation_document_repository_1.default.findByAllocation(allocationId);
    }
    async delete(id) {
        const doc = await allocation_document_repository_1.default.findById(id);
        if (doc?.fileUrl) {
            const filePath = path_1.default.join(process.cwd(), doc.fileUrl);
            if (fs_1.default.existsSync(filePath)) {
                await fs_1.default.promises.unlink(filePath);
            }
        }
        return allocation_document_repository_1.default.delete(id);
    }
}
exports.default = new AllocationDocumentService();
