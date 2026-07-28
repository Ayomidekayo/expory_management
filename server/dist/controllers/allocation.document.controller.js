"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allocation_document_service_1 = __importDefault(require("../services/allocation-document.service"));
const allocation_document_validation_1 = require("../validations/allocation.document.validation");
class AllocationDocumentController {
    /*
    =====================================
    Upload Document
    =====================================
    */
    async create(req, res, next) {
        try {
            const allocationId = String(req.params.id);
            const body = allocation_document_validation_1.createAllocationDocumentSchema.parse(req.body);
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Document is required.",
                });
            }
            const document = await allocation_document_service_1.default.create({
                allocationId,
                type: body.type,
                remarks: body.remarks,
                fileName: req.file.filename,
                originalName: req.file.originalname,
                fileUrl: `/uploads/allocations/${req.file.filename}`,
                mimeType: req.file.mimetype,
                extension: req.file.originalname
                    .split(".")
                    .pop(),
                fileSize: req.file.size,
                uploadedById: req.user?.id ?? null,
            });
            res.status(201).json({
                success: true,
                message: "Document uploaded successfully.",
                data: document,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Allocation Documents
    =====================================
    */
    async findAll(req, res, next) {
        try {
            const allocationId = String(req.params.id);
            const documents = await allocation_document_service_1.default.list(allocationId);
            res.json({
                success: true,
                data: documents,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Delete Document
    =====================================
    */
    async delete(req, res, next) {
        try {
            const documentId = String(req.params.documentId);
            await allocation_document_service_1.default.delete(documentId);
            res.json({
                success: true,
                message: "Document deleted successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new AllocationDocumentController();
