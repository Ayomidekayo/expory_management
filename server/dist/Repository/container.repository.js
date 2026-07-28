"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
class ContainerRepository {
    async create(data) {
        return prisma_1.prisma.container.create({
            data: {
                shipmentId: data.shipmentId,
                packingListId: data.packingListId,
                containerNumber: data.containerNumber,
                sealNumber: data.sealNumber,
                containerType: data.containerType,
                containerSize: data.containerSize,
                grossWeight: data.grossWeight,
                netWeight: data.netWeight,
                tareWeight: data.tareWeight,
                volume: data.volume,
                loadingLocation: data.loadingLocation,
                destination: data.destination,
                status: data.status,
                shippingLine: data.shippingLine,
                bookingReference: data.bookingReference,
                containerCondition: data.containerCondition,
            },
            include: this.detailsInclude,
        });
        ;
    }
    async findLatestContainer() {
        return prisma_1.prisma.container.findFirst({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                containerNumber: true,
            },
        });
    }
    async findAll(query) {
        const { page, limit, search, shipmentId, packingListId, status, containerType, containerSize, sortBy, sortOrder, } = query;
        const where = {
            ...(shipmentId && {
                shipmentId,
            }),
            ...(packingListId && {
                packingListId,
            }),
            ...(status && {
                status,
            }),
            ...(containerType && {
                containerType,
            }),
            ...(containerSize && {
                containerSize,
            }),
            ...(search && {
                OR: [
                    {
                        containerNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        sealNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        bookingReference: {
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
                ],
            }),
        };
        const [data, total] = await Promise.all([
            prisma_1.prisma.container.findMany({
                where,
                include: this.listInclude,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma_1.prisma.container.count({
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
    async findById(id) {
        return prisma_1.prisma.container.findUnique({
            where: {
                id,
            },
            include: this.detailsInclude,
        });
    }
    async findByContainerNumber(containerNumber) {
        return prisma_1.prisma.container.findUnique({
            where: {
                containerNumber,
            },
        });
    }
    async update(id, data) {
        return prisma_1.prisma.container.update({
            where: {
                id,
            },
            data,
            include: this.detailsInclude,
        });
    }
    async delete(id) {
        return prisma_1.prisma.container.delete({
            where: {
                id,
            },
        });
    }
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
        packingList: {
            select: {
                id: true,
                packingListNumber: true,
            },
        },
        _count: {
            select: {
                documents: true,
                transits: true,
            },
        },
    };
    detailsInclude = {
        shipment: {
            include: {
                client: true,
                exporter: true,
                consignee: true,
                allocation: true,
            },
        },
        packingList: true,
        documents: true,
        transits: true,
        _count: {
            select: {
                documents: true,
                transits: true,
            },
        },
    };
}
exports.default = new ContainerRepository();
