"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consignee_service_1 = __importDefault(require("../services/consignee.service"));
const consignee_validation_1 = require("../validations/consignee.validation");
class ConsigneeController {
    /*
    =====================================
    Create Consignee
    =====================================
    */
    async create(req, res, next) {
        try {
            const data = consignee_validation_1.createConsigneeSchema.parse(req.body);
            const consignee = await consignee_service_1.default.createConsignee(data);
            res.status(201).json({
                success: true,
                message: "Consignee created successfully.",
                data: consignee,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Get All Consignees
    =====================================
    */
    async findAll(req, res, next) {
        try {
            const consignees = await consignee_service_1.default.getConsignees();
            res.status(200).json({
                success: true,
                data: consignees,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Get One Consignee
    =====================================
    */
    async findOne(req, res, next) {
        try {
            const id = String(req.params.id);
            const consignee = await consignee_service_1.default.getConsignee(id);
            res.status(200).json({
                success: true,
                data: consignee,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Update Consignee
    =====================================
    */
    async update(req, res, next) {
        try {
            const id = String(req.params.id);
            const data = consignee_validation_1.updateConsigneeSchema.parse(req.body);
            const consignee = await consignee_service_1.default.updateConsignee(id, data);
            res.status(200).json({
                success: true,
                message: "Consignee updated successfully.",
                data: consignee,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Delete Consignee
    =====================================
    */
    async delete(req, res, next) {
        try {
            const id = String(req.params.id);
            await consignee_service_1.default.deleteConsignee(id);
            res.status(200).json({
                success: true,
                message: "Consignee deleted successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new ConsigneeController();
