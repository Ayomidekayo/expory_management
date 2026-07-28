"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const document_repository_1 = __importDefault(require("../Repository/document.repository"));
const shipment_repository_1 = __importDefault(require("../Repository/shipment.repository"));
const container_repository_1 = __importDefault(require("../Repository/container.repository"));
const packing_list_repository_1 = __importDefault(require("../Repository/packing-list.repository"));
const invoice_repository_1 = __importDefault(require("../Repository/invoice.repository"));
const transit_repository_1 = __importDefault(require("../Repository/transit.repository"));
const allocation_repository_1 = __importDefault(require("../Repository/allocation.repository"));
class DocumentService {
    /*
    =====================================
    Create
    =====================================
    */
    async create(file, data) {
        if (!file) {
            throw new Error("Please upload a document.");
        }
        /*
        =====================================
        Validate Parent Record
        =====================================
        */
        if (data.allocationId) {
            const allocation = await allocation_repository_1.default.findById(data.allocationId);
            if (!allocation) {
                throw new Error("Allocation not found.");
            }
        }
        if (data.shipmentId) {
            const shipment = await shipment_repository_1.default.findById(data.shipmentId);
            if (!shipment) {
                throw new Error("Shipment not found.");
            }
        }
        if (data.containerId) {
            const container = await container_repository_1.default.findById(data.containerId);
            if (!container) {
                throw new Error("Container not found.");
            }
        }
        if (data.packingListId) {
            const packingList = await packing_list_repository_1.default.findById(data.packingListId);
            if (!packingList) {
                throw new Error("Packing List not found.");
            }
        }
        if (data.invoiceId) {
            const invoice = await invoice_repository_1.default.findById(data.invoiceId);
            if (!invoice) {
                throw new Error("Invoice not found.");
            }
        }
        if (data.transitId) {
            const transit = await transit_repository_1.default.findById(data.transitId);
            if (!transit) {
                throw new Error("Transit not found.");
            }
        }
        return document_repository_1.default.create({
            ...data,
            fileName: file.filename,
            fileUrl: `/uploads/documents/${file.filename}`,
            mimeType: file.mimetype,
            fileSize: file.size,
        });
    }
    /*
    =====================================
    Find All
    =====================================
    */
    async findAll(query) {
        return document_repository_1.default.findAll(query);
    }
    /*
    =====================================
    Find By Id
    =====================================
    */
    async findById(id) {
        const document = await document_repository_1.default.findById(id);
        if (!document) {
            throw new Error("Document not found.");
        }
        return document;
    }
    /*
    =====================================
    Update
    =====================================
    */
    async update(id, data) {
        await this.findById(id);
        return document_repository_1.default.update(id, data);
    }
    /*
    =====================================
    Delete
    =====================================
    */
    async delete(id) {
        const document = await this.findById(id);
        /*
        =====================================
        Delete Physical File
        =====================================
        */
        const filePath = path_1.default.join(process.cwd(), document.fileUrl.replace("/uploads/", "uploads/"));
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        return document_repository_1.default.delete(id);
    }
}
exports.default = new DocumentService();
