"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allocation_service_1 = __importDefault(require("../services/allocation.service"));
const allocation_validation_1 = require("../validations/allocation.validation");
const allocation_query_validation_1 = require("../validations/allocation-query.validation");
class AllocationController {
    async updateStatus(req, res, next) {
        try {
            const allocation = await allocation_service_1.default.updateStatus(req.params.id, req.body.status);
            res.status(200).json({
                success: true,
                message: "Allocation status updated successfully.",
                data: allocation,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Create Allocation
    =====================================
    */
    async create(req, res, next) {
        try {
            const data = allocation_validation_1.createAllocationSchema.parse(req.body);
            const allocation = await allocation_service_1.default.create(data, req.user.id);
            res.status(201).json({
                success: true,
                message: "Allocation created successfully.",
                data: allocation,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Get Allocations
    =====================================
    */
    async findAll(req, res, next) {
        try {
            const query = allocation_query_validation_1.AllocationQueryDto.parse(req.query);
            const allocations = await allocation_service_1.default.findAll(query);
            res.status(200).json({
                success: true,
                ...allocations,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Get Allocation
    =====================================
    */
    async findOne(req, res, next) {
        try {
            const allocation = await allocation_service_1.default.findById(req.params.id);
            res.status(200).json({
                success: true,
                data: allocation,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Update Allocation
    =====================================
    */
    async update(req, res, next) {
        try {
            const data = allocation_validation_1.updateAllocationSchema.parse(req.body);
            const allocation = await allocation_service_1.default.update(req.params.id, data);
            res.status(200).json({
                success: true,
                message: "Allocation updated successfully.",
                data: allocation,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Delete Allocation
    =====================================
    */
    async delete(req, res, next) {
        try {
            await allocation_service_1.default.delete(req.params.id);
            res.status(200).json({
                success: true,
                message: "Allocation deleted successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new AllocationController();
