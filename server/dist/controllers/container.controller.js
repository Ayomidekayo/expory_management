"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const container_service_1 = __importDefault(require("../services/container.service"));
const container_validation_1 = require("../validations/container.validation");
const container_query_validation_1 = require("../validations/container-query.validation");
class ContainerController {
    /*
    =====================================
    Create
    =====================================
    */
    async create(req, res, next) {
        try {
            const data = container_validation_1.createContainerSchema.parse(req.body);
            const container = await container_service_1.default.create(data);
            res.status(201).json({
                success: true,
                message: "Container created successfully.",
                data: container,
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
            const query = container_query_validation_1.ContainerQueryDto.parse(req.query);
            const result = await container_service_1.default.findAll(query);
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
    Find One
    =====================================
    */
    async findById(req, res, next) {
        try {
            const id = String(req.params.id);
            const container = await container_service_1.default.findById(id);
            res.status(200).json({
                success: true,
                data: container,
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
            const data = container_validation_1.updateContainerSchema.parse(req.body);
            const container = await container_service_1.default.update(id, data);
            res.status(200).json({
                success: true,
                message: "Container updated successfully.",
                data: container,
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
            await container_service_1.default.delete(id);
            res.status(200).json({
                success: true,
                message: "Container deleted successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new ContainerController();
