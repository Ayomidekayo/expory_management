"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const invoice_service_1 = __importDefault(require("../services/invoice.service"));
const invoice_validation_1 = require("../validations/invoice.validation");
const invoice_query_validation_1 = require("../validations/invoice-query.validation");
class InvoiceController {
    /*
    =====================================
    Create Invoice
    =====================================
    */
    async create(req, res, next) {
        try {
            const data = invoice_validation_1.createInvoiceSchema.parse(req.body);
            const invoice = await invoice_service_1.default.create(data);
            res.status(201).json({
                success: true,
                message: "Invoice created successfully.",
                data: invoice,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Get All Invoices
    =====================================
    */
    async findAll(req, res, next) {
        try {
            const query = invoice_query_validation_1.InvoiceQueryDto.parse(req.query);
            const invoices = await invoice_service_1.default.findAll(query);
            res.status(200).json({
                success: true,
                ...invoices,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Get Invoice
    =====================================
    */
    async findOne(req, res, next) {
        try {
            const id = String(req.params.id);
            const invoice = await invoice_service_1.default.findById(id);
            res.status(200).json({
                success: true,
                data: invoice,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Update Invoice
    =====================================
    */
    async update(req, res, next) {
        try {
            const id = String(req.params.id);
            const data = invoice_validation_1.updateInvoiceSchema.parse(req.body);
            const invoice = await invoice_service_1.default.update(id, data);
            res.status(200).json({
                success: true,
                message: "Invoice updated successfully.",
                data: invoice,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Delete Invoice
    =====================================
    */
    async delete(req, res, next) {
        try {
            const id = String(req.params.id);
            await invoice_service_1.default.delete(id);
            res.status(200).json({
                success: true,
                message: "Invoice deleted successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new InvoiceController();
