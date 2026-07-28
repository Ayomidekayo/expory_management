"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
class ClientRepository {
    /*
    =====================================
    Create
    =====================================
    */
    async create(data) {
        return prisma_1.prisma.client.create({
            data,
            include: {
                _count: {
                    select: {
                        allocations: true,
                        shipments: true,
                    },
                },
            },
        });
    }
    /*
    =====================================
    Find All
    =====================================
    */
    async findAll(query) {
        const { page, limit, search, clientType, country, isActive, } = query;
        const where = {
            ...(clientType && {
                clientType,
            }),
            ...(country && {
                country: {
                    equals: country,
                    mode: "insensitive",
                },
            }),
            ...(isActive !== undefined && {
                isActive,
            }),
            ...(search && {
                OR: [
                    {
                        companyName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        clientCode: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        contactPerson: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        phone: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
        };
        const [clients, total] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.client.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    _count: {
                        select: {
                            allocations: true,
                            shipments: true,
                        },
                    },
                },
            }),
            prisma_1.prisma.client.count({
                where,
            }),
        ]);
        return {
            data: clients,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    /*
    =====================================
    Find By Id
    =====================================
    */
    async findById(id) {
        return prisma_1.prisma.client.findUnique({
            where: {
                id,
            },
            include: {
                allocations: {
                    include: {
                        shipment: true,
                    },
                },
                shipments: true,
                _count: {
                    select: {
                        allocations: true,
                        shipments: true,
                    },
                },
            },
        });
    }
    /*
    =====================================
    Update
    =====================================
    */
    async update(id, data) {
        return prisma_1.prisma.client.update({
            where: {
                id,
            },
            data,
            include: {
                _count: {
                    select: {
                        allocations: true,
                        shipments: true,
                    },
                },
            },
        });
    }
    /*
    =====================================
    Delete
    =====================================
    */
    async delete(id) {
        return prisma_1.prisma.client.delete({
            where: {
                id,
            },
        });
    }
    /*
    =====================================
    Activate / Deactivate
    =====================================
    */
    async updateStatus(id, isActive) {
        return prisma_1.prisma.client.update({
            where: {
                id,
            },
            data: {
                isActive,
            },
        });
    }
}
exports.default = new ClientRepository();
