"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
class TransitRepository {
    /*
    =====================================
    Create
    =====================================
    */
    async create(data) {
        return prisma_1.prisma.transit.create({
            data: {
                transitNumber: data.transitNumber,
                shipmentId: data.shipmentId,
                containerId: data.containerId,
                origin: data.origin,
                destination: data.destination,
                transportMode: data.transportMode,
                transporter: data.transporter,
                transitInvoice: data.transitInvoice,
                agentNumber: data.agentNumber,
                exporterNumber: data.exporterNumber,
                wibNumber: data.wibNumber,
                quantity: data.quantity,
                description: data.description,
                unitPrice: data.unitPrice,
                totalPrice: data.totalPrice,
            },
            include: this.detailsInclude,
        });
    }
    /*
    =====================================
    Latest Transit
    =====================================
    */
    async findLatestTransit() {
        return prisma_1.prisma.transit.findFirst({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                transitNumber: true,
            },
        });
    }
    /*
    =====================================
    Find All
    =====================================
    */
    async findAll(query) {
        const { page, limit, search, shipmentId, containerId, transportMode, sortBy, sortOrder, } = query;
        const where = {
            ...(shipmentId && {
                shipmentId,
            }),
            ...(containerId && {
                containerId,
            }),
            ...(transportMode && {
                transportMode,
            }),
            ...(search && {
                OR: [
                    {
                        transitNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        origin: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        destination: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        transporter: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        shipment: {
                            shipmentNumber: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                    {
                        container: {
                            containerNumber: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            prisma_1.prisma.transit.findMany({
                where,
                include: this.listInclude,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma_1.prisma.transit.count({
                where,
            }),
        ]);
        return {
            data,
            pagination: {
                page,
                limit,
                total,
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
        return prisma_1.prisma.transit.findUnique({
            where: {
                id,
            },
            include: this.detailsInclude,
        });
    }
    /*
    =====================================
    Find By Transit Number
    =====================================
    */
    async findByTransitNumber(transitNumber) {
        return prisma_1.prisma.transit.findUnique({
            where: {
                transitNumber,
            },
        });
    }
    /*
    =====================================
    Update
    =====================================
    */
    async update(id, data) {
        return prisma_1.prisma.transit.update({
            where: {
                id,
            },
            data,
            include: this.detailsInclude,
        });
    }
    /*
    =====================================
    Delete
    =====================================
    */
    async delete(id) {
        return prisma_1.prisma.transit.delete({
            where: {
                id,
            },
        });
    }
    /*
    =====================================
    LIST INCLUDE
    =====================================
    */
    listInclude = {
        shipment: {
            select: {
                id: true,
                shipmentNumber: true,
                client: {
                    select: {
                        companyName: true,
                    },
                },
            },
        },
        container: {
            select: {
                id: true,
                containerNumber: true,
                containerType: true,
                containerSize: true,
            },
        },
        _count: {
            select: {
                documents: true,
            },
        },
    };
    /*
    =====================================
    DETAILS INCLUDE
    =====================================
    */
    detailsInclude = {
        shipment: {
            include: {
                client: true,
                exporter: true,
                consignee: true,
                allocation: true,
            },
        },
        container: {
            include: {
                packingList: true,
            },
        },
        documents: true,
        _count: {
            select: {
                documents: true,
            },
        },
    };
}
exports.default = new TransitRepository();
