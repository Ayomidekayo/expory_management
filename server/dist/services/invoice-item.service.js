"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
const invoice_item_repository_1 = __importDefault(require("../Repository/invoice-item.repository"));
class InvoiceItemService {
    /*
    =====================================
    Create Invoice Item
    =====================================
    */
    async createItem(invoiceId, data) {
        /*
        =====================================
        Ensure Invoice Exists
        =====================================
        */
        const invoice = await prisma_1.prisma.invoice.findUnique({
            where: {
                id: invoiceId,
            },
        });
        if (!invoice) {
            throw new Error("Invoice not found.");
        }
        /*
        =====================================
        Calculate Total
        =====================================
        */
        const total = Number(data.quantity) *
            Number(data.unitPrice);
        /*
        =====================================
        Create Item
        =====================================
        */
        const item = await invoice_item_repository_1.default.create(invoiceId, data, total);
        /*
        =====================================
        Recalculate Invoice Total
        =====================================
        */
        await invoice_item_repository_1.default.updateInvoiceTotal(invoiceId);
        return item;
    }
    /*
    =====================================
    Get Invoice Items
    =====================================
    */
    async getInvoiceItems(invoiceId) {
        return invoice_item_repository_1.default.findByInvoice(invoiceId);
    }
    /*
    =====================================
    Get Invoice Item
    =====================================
    */
    async getInvoiceItem(id) {
        const item = await invoice_item_repository_1.default.findById(id);
        if (!item) {
            throw new Error("Invoice item not found.");
        }
        return item;
    }
    /*
    =====================================
    Update Invoice Item
    =====================================
    */
    async updateItem(id, data) {
        const existing = await this.getInvoiceItem(id);
        const quantity = Number(data.quantity ??
            existing.quantity);
        const unitPrice = Number(data.unitPrice ??
            existing.unitPrice);
        const total = quantity * unitPrice;
        const item = await invoice_item_repository_1.default.update(id, data, total);
        await invoice_item_repository_1.default.updateInvoiceTotal(existing.invoiceId);
        return item;
    }
    /*
    =====================================
    Delete Invoice Item
    =====================================
    */
    async deleteItem(id) {
        const item = await this.getInvoiceItem(id);
        await invoice_item_repository_1.default.delete(id);
        await invoice_item_repository_1.default.updateInvoiceTotal(item.invoiceId);
        return {
            message: "Invoice item deleted successfully.",
        };
    }
}
exports.default = new InvoiceItemService();
