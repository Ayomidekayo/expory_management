"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExporterService = void 0;
const exporter_repository_1 = require("../Repository/exporter.repository");
const ApiError_1 = require("../utils/ApiError");
class ExporterService {
    repository = new exporter_repository_1.ExporterRepository();
    async findAll() {
        return this.repository.findAll();
    }
    async findById(id) {
        const exporter = await this.repository.findById(id);
        if (!exporter) {
            throw new ApiError_1.ApiError(404, "Exporter not found.");
        }
        return exporter;
    }
    async create(data) {
        return this.repository.create(data);
    }
    async update(id, data) {
        await this.findById(id);
        return this.repository.update(id, data);
    }
    async delete(id) {
        const exporter = await this.findById(id);
        if (exporter._count.allocations > 0 ||
            exporter._count.shipments > 0) {
            throw new ApiError_1.ApiError(400, "Exporter cannot be deleted because it is linked to allocations or shipments.");
        }
        return this.repository.delete(id);
    }
}
exports.ExporterService = ExporterService;
