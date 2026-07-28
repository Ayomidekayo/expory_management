"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
class ShipmentRepository {
    /*
    =====================================
    Create
    =====================================
    */
    async create(data) {
        return prisma_1.prisma.shipment.create({
            data: {
                ...data,
                shipmentDate: new Date(data.shipmentDate),
                expectedDeparture: data.expectedDeparture
                    ? new Date(data.expectedDeparture)
                    : undefined,
                expectedArrival: data.expectedArrival
                    ? new Date(data.expectedArrival)
                    : undefined,
                actualDeparture: data.actualDeparture
                    ? new Date(data.actualDeparture)
                    : undefined,
                actualArrival: data.actualArrival
                    ? new Date(data.actualArrival)
                    : undefined,
            },
            include: this.detailsInclude,
        });
    }
    /*
    =====================================
    Find Latest Shipment
    =====================================
    */
    async findLatestShipment() {
        return prisma_1.prisma.shipment.findFirst({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                shipmentNumber: true,
            },
        });
    }
    /*
    =====================================
    Find All
    =====================================
    */
    async findAll(query) {
        const { page, limit, search, status, transportMode, clientId, exporterId, consigneeId, allocationId, sortBy, sortOrder, } = query;
        const where = {
            ...(status && {
                status,
            }),
            ...(transportMode && {
                transportMode,
            }),
            ...(clientId && {
                clientId,
            }),
            ...(exporterId && {
                exporterId,
            }),
            ...(consigneeId && {
                consigneeId,
            }),
            ...(allocationId && {
                allocationId,
            }),
            ...(search && {
                OR: [
                    {
                        shipmentNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        bookingNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        vesselName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        shippingLine: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        client: {
                            companyName: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            prisma_1.prisma.shipment.findMany({
                where,
                include: this.listInclude,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma_1.prisma.shipment.count({
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
        return prisma_1.prisma.shipment.findUnique({
            where: {
                id,
            },
            include: this.detailsInclude,
        });
    }
    /*
    =====================================
    Find By Allocation
    =====================================
    */
    async findByAllocationId(allocationId) {
        return prisma_1.prisma.shipment.findUnique({
            where: {
                allocationId,
            },
        });
    }
    async findAvailable() {
        return prisma_1.prisma.shipment.findMany({
            where: {
                invoice: null,
            },
            include: this.listInclude,
            orderBy: {
                shipmentDate: "desc",
            },
        });
    }
    /*
    =====================================
    Update
    =====================================
    */
    async update(id, data) {
        return prisma_1.prisma.shipment.update({
            where: {
                id,
            },
            data: {
                ...data,
                shipmentDate: data.shipmentDate
                    ? new Date(data.shipmentDate)
                    : undefined,
                expectedDeparture: data.expectedDeparture !==
                    undefined
                    ? data.expectedDeparture
                        ? new Date(data.expectedDeparture)
                        : null
                    : undefined,
                expectedArrival: data.expectedArrival !==
                    undefined
                    ? data.expectedArrival
                        ? new Date(data.expectedArrival)
                        : null
                    : undefined,
                actualDeparture: data.actualDeparture !==
                    undefined
                    ? data.actualDeparture
                        ? new Date(data.actualDeparture)
                        : null
                    : undefined,
                actualArrival: data.actualArrival !==
                    undefined
                    ? data.actualArrival
                        ? new Date(data.actualArrival)
                        : null
                    : undefined,
            },
            include: this.detailsInclude,
        });
    }
    /*
    =====================================
    Delete
    =====================================
    */
    async delete(id) {
        return prisma_1.prisma.shipment.delete({
            where: {
                id,
            },
        });
    }
    /*
    =====================================
    Shared Include
    =====================================
    */
    listInclude = {
        client: {
            select: {
                id: true,
                companyName: true,
            },
        },
        exporter: {
            select: {
                id: true,
                name: true,
            },
        },
        consignee: {
            select: {
                id: true,
                name: true,
            },
        },
        allocation: {
            select: {
                id: true,
                allocationNumber: true,
            },
        },
        _count: {
            select: {
                containers: true,
                documents: true,
                transits: true,
            },
        },
    };
    detailsInclude = {
        client: true,
        exporter: true,
        consignee: true,
        allocation: {
            select: {
                id: true,
                allocationNumber: true,
                serviceType: true,
                priority: true,
                status: true,
            },
        },
        invoice: true,
        packingList: true,
        containers: true,
        transits: true,
        documents: true,
        createdBy: {
            select: {
                id: true,
                name: true,
                email: true,
            },
        },
        _count: {
            select: {
                containers: true,
                documents: true,
                transits: true,
            },
        },
    };
}
exports.default = new ShipmentRepository();
