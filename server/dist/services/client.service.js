"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
const client_repository_1 = __importDefault(require("../Repository/client.repository"));
const ApiError_1 = require("../utils/ApiError");
const generateClientCode_1 = require("../utils/generateClientCode");
class ClientService {
    /*
    =====================================
    Create Client
    =====================================
    */
    async create(data) {
        /*
        Prevent Duplicate Email
        */
        if (data.email) {
            const existingEmail = await prisma_1.prisma.client.findFirst({
                where: {
                    email: data.email,
                },
            });
            if (existingEmail) {
                throw new ApiError_1.ApiError(400, "Email already exists.");
            }
        }
        /*
        Generate Client Code
        */
        const clientCode = await (0, generateClientCode_1.generateClientCode)();
        return client_repository_1.default.create({
            clientCode,
            companyName: data.companyName,
            clientType: data.clientType,
            contactPerson: data.contactPerson,
            email: data.email,
            phone: data.phone,
            alternatePhone: data.alternatePhone,
            address: data.address,
            city: data.city,
            state: data.state,
            country: data.country,
            website: data.website,
            taxNumber: data.taxNumber,
            remarks: data.remarks,
        });
    }
    /*
    =====================================
    Find All Clients
    =====================================
    */
    async findAll(query) {
        return client_repository_1.default.findAll(query);
    }
    /*
    =====================================
    Find Client By Id
    =====================================
    */
    async findById(id) {
        const client = await client_repository_1.default.findById(id);
        if (!client) {
            throw new ApiError_1.ApiError(404, "Client not found.");
        }
        return client;
    }
    /*
    =====================================
    Update Client
    =====================================
    */
    async update(id, data) {
        await this.findById(id);
        /*
        Prevent Duplicate Email
        */
        if (data.email) {
            const existing = await prisma_1.prisma.client.findFirst({
                where: {
                    email: data.email,
                    NOT: {
                        id,
                    },
                },
            });
            if (existing) {
                throw new ApiError_1.ApiError(400, "Email already exists.");
            }
        }
        return client_repository_1.default.update(id, data);
    }
    /*
    =====================================
    Delete Client
    =====================================
    */
    async delete(id) {
        const client = await this.findById(id);
        if (client._count.allocations >
            0 ||
            client._count.shipments > 0) {
            throw new ApiError_1.ApiError(400, "This client cannot be deleted because it has related allocations or shipments.");
        }
        return client_repository_1.default.delete(id);
    }
    /*
    =====================================
    Activate / Deactivate Client
    =====================================
    */
    async updateStatus(id, isActive) {
        await this.findById(id);
        return client_repository_1.default.updateStatus(id, isActive);
    }
}
exports.default = new ClientService();
