"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExporterController = void 0;
const exporter_validation_1 = require("../validations/exporter.validation");
const exporter_service_1 = require("../services/exporter.service");
const service = new exporter_service_1.ExporterService();
class ExporterController {
    /*
    =====================================
    Get All Exporters
    =====================================
    */
    async findAll(req, res, next) {
        try {
            const exporters = await service.findAll();
            res.status(200).json({
                success: true,
                data: exporters,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Get Exporter
    =====================================
    */
    async findById(req, res, next) {
        try {
            const id = String(req.params.id);
            const exporter = await service.findById(id);
            res.status(200).json({
                success: true,
                data: exporter,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Create Exporter
    =====================================
    */
    async create(req, res, next) {
        try {
            const validated = exporter_validation_1.createExporterSchema.parse(req.body);
            const exporter = await service.create(validated);
            res.status(201).json({
                success: true,
                message: "Exporter created successfully.",
                data: exporter,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Update Exporter
    =====================================
    */
    async update(req, res, next) {
        try {
            const id = String(req.params.id);
            const validated = exporter_validation_1.updateExporterSchema.parse(req.body);
            const exporter = await service.update(id, validated);
            res.status(200).json({
                success: true,
                message: "Exporter updated successfully.",
                data: exporter,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Delete Exporter
    =====================================
    */
    async delete(req, res, next) {
        try {
            const id = String(req.params.id);
            await service.delete(id);
            res.status(200).json({
                success: true,
                message: "Exporter deleted successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ExporterController = ExporterController;
exports.default = new ExporterController();
