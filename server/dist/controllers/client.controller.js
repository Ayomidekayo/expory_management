"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_service_1 = __importDefault(require("../services/client.service"));
const client_validation_1 = require("../validations/client.validation");
const client_query_validation_1 = require("../validations/client-query.validation");
class ClientController {
    /*
    =====================================
    Create Client
    =====================================
    */
    async create(req, res, next) {
        try {
            const data = client_validation_1.createClientSchema.parse(req.body);
            const client = await client_service_1.default.create(data);
            res.status(201).json({
                success: true,
                message: "Client created successfully.",
                data: client,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Get Clients
    =====================================
    */
    async findAll(req, res, next) {
        try {
            const query = client_query_validation_1.ClientQueryDto.parse(req.query);
            const clients = await client_service_1.default.findAll(query);
            res.status(200).json({
                success: true,
                ...clients,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Get Client
    =====================================
    */
    async findOne(req, res, next) {
        try {
            const id = String(req.params.id);
            const client = await client_service_1.default.findById(id);
            res.status(200).json({
                success: true,
                data: client,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Update Client
    =====================================
    */
    async update(req, res, next) {
        try {
            const id = String(req.params.id);
            const data = client_validation_1.updateClientSchema.parse(req.body);
            const client = await client_service_1.default.update(id, data);
            res.status(200).json({
                success: true,
                message: "Client updated successfully.",
                data: client,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Delete Client
    =====================================
    */
    async delete(req, res, next) {
        try {
            const id = String(req.params.id);
            await client_service_1.default.delete(id);
            res.status(200).json({
                success: true,
                message: "Client deleted successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Activate / Deactivate
    =====================================
    */
    async updateStatus(req, res, next) {
        try {
            const id = String(req.params.id);
            const client = await client_service_1.default.updateStatus(id, req.body.isActive);
            res.status(200).json({
                success: true,
                message: client.isActive
                    ? "Client activated successfully."
                    : "Client deactivated successfully.",
                data: client,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new ClientController();
