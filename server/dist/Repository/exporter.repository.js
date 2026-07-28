"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExporterRepository = void 0;
const prisma_1 = require("../config/prisma");
class ExporterRepository {
    async findAll() {
        return prisma_1.prisma.exporter.findMany({
            include: {
                _count: {
                    select: {
                        allocations: true,
                        shipments: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async findById(id) {
        return prisma_1.prisma.exporter.findUnique({
            where: {
                id,
            },
            include: {
                allocations: {
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
            },
        });
    }
    async create(data) {
        return prisma_1.prisma.exporter.create({
            data,
        });
    }
    async update(id, data) {
        return prisma_1.prisma.exporter.update({
            where: {
                id,
            },
            data,
        });
    }
    async delete(id) {
        return prisma_1.prisma.exporter.delete({
            where: {
                id,
            },
        });
    }
}
exports.ExporterRepository = ExporterRepository;
exports.default = new ExporterRepository();
