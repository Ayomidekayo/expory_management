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
                throw new Error("Please upload a document.");
            }
            const data = document_validation_1.createDocumentSchema.parse(req.body);
            const document = await document_service_1.default.create(req.file, data);
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
    Find All
    =====================================
    */
    async findAll(req, res, next) {
        try {
            const query = document_query_validation_1.DocumentQueryDto.parse(req.query);
            const result = await document_service_1.default.findAll(query);
            res.status(200).json({
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
            const id = String(req.params.id);
            const document = await document_service_1.default.findById(id);
            res.status(200).json({
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
            const id = String(req.params.id);
            const data = document_validation_1.updateDocumentSchema.parse(req.body);
            const document = await document_service_1.default.update(id, data);
            res.status(200).json({
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
            const id = String(req.params.id);
            await document_service_1.default.delete(id);
            res.status(200).json({
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
