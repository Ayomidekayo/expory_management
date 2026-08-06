"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const document_service_1 = __importDefault(require("../services/document.service"));
const document_validation_1 = require("../validations/document.validation");
const document_query_validation_1 = require("../validations/document-query.validation");
class DocumentController {
    /*
    =====================================
    Upload Document
    =====================================
    */
    async create(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Please upload a document.",
                });
            }
            console.log("========== DOCUMENT UPLOAD ==========");
            console.log("BODY:", req.body);
            console.log("FILE:", req.file);
            console.log("=====================================");
            const body = document_validation_1.createDocumentSchema.parse(req.body);
            const document = await document_service_1.default.create(req.file, body);
            return res.status(201).json({
                success: true,
                message: "Document uploaded successfully.",
                data: document,
            });
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    /*
    =====================================
    Find All
    =====================================
    */
    async findAll(req, res, next) {
        try {
            const query = document_query_validation_1.DocumentQueryDto.parse(req.query);
            const result = await document_service_1.default.findAll(query);
            return res.status(200).json({
                success: true,
                ...result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Find By Id
    =====================================
    */
    async findById(req, res, next) {
        try {
            const document = await document_service_1.default.findById(req.params.id);
            return res.status(200).json({
                success: true,
                data: document,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Update
    =====================================
    */
    async update(req, res, next) {
        try {
            const body = document_validation_1.updateDocumentSchema.parse(req.body);
            const document = await document_service_1.default.update(req.params.id, body);
            return res.status(200).json({
                success: true,
                message: "Document updated successfully.",
                data: document,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Delete
    =====================================
    */
    async delete(req, res, next) {
        try {
            await document_service_1.default.delete(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Document deleted successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new DocumentController();
