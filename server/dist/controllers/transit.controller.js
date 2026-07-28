"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transit_service_1 = __importDefault(require("../services/transit.service"));
const transit_validation_1 = require("../validations/transit.validation");
const transit_query_validation_1 = require("../validations/transit-query.validation");
class TransitController {
    /*
    =====================================
    Create
    =====================================
    */
    async create(req, res, next) {
        try {
            const data = transit_validation_1.createTransitSchema.parse(req.body);
            const transit = await transit_service_1.default.create(data);
            res.status(201).json({
                success: true,
                message: "Transit created successfully.",
                data: transit,
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
            const query = transit_query_validation_1.TransitQueryDto.parse(req.query);
            const result = await transit_service_1.default.findAll(query);
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
            const transit = await transit_service_1.default.findById(id);
            res.status(200).json({
                success: true,
                data: transit,
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
            const data = transit_validation_1.updateTransitSchema.parse(req.body);
            const transit = await transit_service_1.default.update(id, data);
            res.status(200).json({
                success: true,
                message: "Transit updated successfully.",
                data: transit,
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
            await transit_service_1.default.delete(id);
            res.status(200).json({
                success: true,
                message: "Transit deleted successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new TransitController();
