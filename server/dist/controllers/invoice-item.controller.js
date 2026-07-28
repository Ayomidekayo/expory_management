"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const invoice_item_service_1 = __importDefault(require("../services/invoice-item.service"));
const invoice_item_validation_1 = require("../validations/invoice-item.validation");
class InvoiceItemController {
    /*
    =====================================
    Create Invoice Item
    =====================================
    */
    async create(req, res, next) {
        try {
            const invoiceId = String(req.params.invoiceId);
            const data = invoice_item_validation_1.createInvoiceItemSchema.parse(req.body);
            const item = await invoice_item_service_1.default.createItem(invoiceId, data);
            res.status(201).json({
                success: true,
                message: "Invoice item created successfully.",
                data: item,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Get Items By Invoice
    =====================================
    */
    async findByInvoice(req, res, next) {
        try {
            const invoiceId = String(req.params.invoiceId);
            const items = await invoice_item_service_1.default.getInvoiceItems(invoiceId);
            res.status(200).json({
                success: true,
                data: items,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Get One Invoice Item
    =====================================
    */
    async findOne(req, res, next) {
        try {
            const id = String(req.params.id);
            const item = await invoice_item_service_1.default.getInvoiceItem(id);
            res.status(200).json({
                success: true,
                data: item,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Update Invoice Item
    =====================================
    */
    async update(req, res, next) {
        try {
            const id = String(req.params.id);
            const data = invoice_item_validation_1.updateInvoiceItemSchema.parse(req.body);
            const item = await invoice_item_service_1.default.updateItem(id, data);
            res.status(200).json({
                success: true,
                message: "Invoice item updated successfully.",
                data: item,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Delete Invoice Item
    =====================================
    */
    async delete(req, res, next) {
        try {
            const id = String(req.params.id);
            await invoice_item_service_1.default.deleteItem(id);
            res.status(200).json({
                success: true,
                message: "Invoice item deleted successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new InvoiceItemController();
