"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shipment_service_1 = __importDefault(require("../services/shipment.service"));
const shipment_validation_1 = require("../validations/shipment.validation");
const shipment_query_validation_1 = require("../validations/shipment-query.validation");
class ShipmentController {
    /*
    =====================================
    Available Shipments
    =====================================
    */
    async findAvailable(req, res, next) {
        try {
            const shipments = await shipment_service_1.default.findAvailable();
            res.status(200).json({
                success: true,
                data: shipments,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Create Shipment
    =====================================
    */
    async create(req, res, next) {
        try {
            const data = shipment_validation_1.createShipmentSchema.parse(req.body);
            const shipment = await shipment_service_1.default.create(data, req.user.id);
            res.status(201).json({
                success: true,
                message: "Shipment created successfully.",
                data: shipment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Get Shipments
    =====================================
    */
    async findAll(req, res, next) {
        try {
            const query = shipment_query_validation_1.ShipmentQueryDto.parse(req.query);
            const shipments = await shipment_service_1.default.findAll(query);
            res.status(200).json({
                success: true,
                ...shipments,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Get Shipment
    =====================================
    */
    async findOne(req, res, next) {
        try {
            const id = String(req.params.id);
            const shipment = await shipment_service_1.default.findById(id);
            res.status(200).json({
                success: true,
                data: shipment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Update Shipment
    =====================================
    */
    async update(req, res, next) {
        try {
            const id = String(req.params.id);
            const data = shipment_validation_1.updateShipmentSchema.parse(req.body);
            const shipment = await shipment_service_1.default.update(id, data);
            res.status(200).json({
                success: true,
                message: "Shipment updated successfully.",
                data: shipment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Delete Shipment
    =====================================
    */
    async delete(req, res, next) {
        try {
            const id = String(req.params.id);
            await shipment_service_1.default.delete(id);
            res.status(200).json({
                success: true,
                message: "Shipment deleted successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new ShipmentController();
