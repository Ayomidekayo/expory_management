"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
class ConsigneeRepository {
    /*
    =====================================
    Shared Include
    =====================================
    */
    include = {
        allocations: {
            include: {
                client: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        },
        shipments: {
            orderBy: {
                shipmentDate: "desc",
            },
        },
        _count: {
            select: {
                allocations: true,
                shipments: true,
            },
        },
    };
    /*
    =====================================
    Create
    =====================================
    */
    async create(data) {
        return prisma_1.prisma.consignee.create({
            data,
            include: this.include,
        });
    }
    /*
    =====================================
    Find All
    =====================================
    */
    async findAll() {
        return prisma_1.prisma.consignee.findMany({
            include: this.include,
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /*
    =====================================
    Find By Id
    =====================================
    */
    async findById(id) {
        return prisma_1.prisma.consignee.findUnique({
            where: {
                id,
            },
            include: this.include,
        });
    }
    /*
    =====================================
    Find By Email
    =====================================
    */
    async findByEmail(email) {
        return prisma_1.prisma.consignee.findFirst({
            where: {
                email,
            },
        });
    }
    /*
    =====================================
    Update
    =====================================
    */
    async update(id, data) {
        return prisma_1.prisma.consignee.update({
            where: {
                id,
            },
            data,
            include: this.include,
        });
    }
    /*
    =====================================
    Delete
    =====================================
    */
    async delete(id) {
        return prisma_1.prisma.consignee.delete({
            where: {
                id,
            },
            include: this.include,
        });
    }
}
exports.default = new ConsigneeRepository();
