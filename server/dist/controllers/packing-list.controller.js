"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const packing_list_service_1 = __importDefault(require("../services/packing-list.service"));
const packing_list_validation_1 = require("../validations/packing-list.validation");
const packing_list_query_validation_1 = require("../validations/packing-list-query.validation");
class PackingListController {
    /*
    =====================================
    Create Packing List
    =====================================
    */
    async create(req, res, next) {
        try {
            const data = packing_list_validation_1.createPackingListSchema.parse(req.body);
            const packingList = await packing_list_service_1.default.create(data);
            res.status(201).json({
                success: true,
                message: "Packing list created successfully.",
                data: packingList,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Get Packing Lists
    =====================================
    */
    async findAll(req, res, next) {
        try {
            const query = packing_list_query_validation_1.PackingListQueryDto.parse(req.query);
            const packingLists = await packing_list_service_1.default.findAll(query);
            res.status(200).json({
                success: true,
                ...packingLists,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Get Packing List
    =====================================
    */
    async findOne(req, res, next) {
        try {
            const id = String(req.params.id);
            const packingList = await packing_list_service_1.default.findById(id);
            res.status(200).json({
                success: true,
                data: packingList,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Update Packing List
    =====================================
    */
    async update(req, res, next) {
        try {
            const id = String(req.params.id);
            const data = packing_list_validation_1.updatePackingListSchema.parse(req.body);
            const packingList = await packing_list_service_1.default.update(id, data);
            res.status(200).json({
                success: true,
                message: "Packing list updated successfully.",
                data: packingList,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Delete Packing List
    =====================================
    */
    async delete(req, res, next) {
        try {
            const id = String(req.params.id);
            await packing_list_service_1.default.delete(id);
            res.status(200).json({
                success: true,
                message: "Packing list deleted successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new PackingListController();
