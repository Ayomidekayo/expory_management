"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const invoice_repository_1 = __importDefault(require("../Repository/invoice.repository"));
const shipment_repository_1 = __importDefault(require("../Repository/shipment.repository"));
const ApiError_1 = require("../utils/ApiError");
class InvoiceService {
    /*
    =====================================
    Generate Invoice Number
    =====================================
    */
    async generateInvoiceNumber() {
        const year = new Date().getFullYear();
        const latest = await invoice_repository_1.default.findLatestInvoice();
        if (!latest) {
            return `INV-${year}-00001`;
        }
        const sequence = Number(latest.invoiceNumber.split("-")[2]);
        return `INV-${year}-${String(sequence + 1).padStart(5, "0")}`;
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
        const existing = await invoice_repository_1.default.findByShipmentId(data.shipmentId);
        if (existing) {
            throw new ApiError_1.ApiError(400, "This shipment already has an invoice.");
        }
        const invoiceNumber = await this.generateInvoiceNumber();
        return invoice_repository_1.default.create({
            ...data,
            invoiceNumber,
        });
    }
    /*
    =====================================
    Find All
    =====================================
    */
    async findAll(query) {
        return invoice_repository_1.default.findAll(query);
    }
    /*
    =====================================
    Find By Id
    =====================================
    */
    async findById(id) {
        const invoice = await invoice_repository_1.default.findById(id);
        if (!invoice) {
            throw new ApiError_1.ApiError(404, "Invoice not found.");
        }
        return invoice;
    }
    /*
    =====================================
    Update
    =====================================
    */
    async update(id, data) {
        await this.findById(id);
        return invoice_repository_1.default.update(id, data);
    }
    /*
    =====================================
    Delete
    =====================================
    */
    async delete(id) {
        await this.findById(id);
        return invoice_repository_1.default.delete(id);
    }
}
exports.default = new InvoiceService();
