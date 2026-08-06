"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generated_1 = require("../generated");
const prisma_1 = require("../config/prisma");
class AllocationRepository {
    /*
    =====================================
    Update Status
    =====================================
    */
    async updateStatus(id, status) {
        return prisma_1.prisma.allocation.update({
            where: { id },
            data: {
                status,
            },
            include: this.include,
        });
    }
    /*
    =====================================
    Latest Allocation
    =====================================
    */
    async findLatestAllocation() {
        return prisma_1.prisma.allocation.findFirst({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                allocationNumber: true,
            },
        });
    }
    /*
    =====================================
    Create
    =====================================
    */
    async create(data) {
        return prisma_1.prisma.allocation.create({
            data: {
                ...data,
                pickupDate: data.pickupDate
                    ? new Date(data.pickupDate)
                    : undefined,
                expectedShipmentDate: data.expectedShipmentDate
                    ? new Date(data.expectedShipmentDate)
                    : undefined,
            },
            include: this.include,
        });
    }
    /*
    =====================================
    Find All
    =====================================
    */
    async findAll(query) {
        const { page, limit, search, status, priority, serviceType, transportMode, clientId, exporterId, consigneeId, assignedToId, createdById, approvedById, isActive, sortBy, sortOrder, } = query;
        const where = {
            ...(status && { status }),
            ...(priority && { priority }),
            ...(serviceType && { serviceType }),
            ...(transportMode && { transportMode }),
            ...(clientId && { clientId }),
            ...(exporterId && { exporterId }),
            ...(consigneeId && { consigneeId }),
            ...(assignedToId && { assignedToId }),
            ...(createdById && { createdById }),
            ...(approvedById && { approvedById }),
            ...(isActive !== undefined && {
                isActive,
            }),
            ...(search && {
                OR: [
                    {
                        allocationNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        cargoDescription: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        commodityName: {
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
        const [data, total] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.allocation.findMany({
                where,
                include: this.include,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma_1.prisma.allocation.count({
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
        return prisma_1.prisma.allocation.findUnique({
            where: {
                id,
            },
            include: this.include,
        });
    }
    /*
    =====================================
    Update
    =====================================
    */
    async update(id, data) {
        return prisma_1.prisma.allocation.update({
            where: {
                id,
            },
            data: {
                ...data,
                pickupDate: data.pickupDate !== undefined
                    ? data.pickupDate
                        ? new Date(data.pickupDate)
                        : null
                    : undefined,
                expectedShipmentDate: data.expectedShipmentDate !== undefined
                    ? data.expectedShipmentDate
                        ? new Date(data.expectedShipmentDate)
                        : null
                    : undefined,
            },
            include: this.include,
        });
    }
    /*
    =====================================
    Delete
    =====================================
    */
    async delete(id) {
        return prisma_1.prisma.allocation.delete({
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
    include = generated_1.Prisma.validator()({
        client: true,
        exporter: true,
        consignee: true,
        shipment: {
            include: {
                client: true,
                exporter: true,
                consignee: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                documents: true,
                containers: {
                    orderBy: {
                        createdAt: generated_1.Prisma.SortOrder.desc,
                    },
                },
                invoice: true,
                packingList: true,
                transits: {
                    orderBy: {
                        createdAt: generated_1.Prisma.SortOrder.desc,
                    },
                },
            },
        },
        // THIS is what your frontend should use
        attachedDocuments: true,
        createdBy: {
            select: {
                id: true,
                name: true,
                email: true,
            },
        },
        assignedTo: {
            select: {
                id: true,
                name: true,
                email: true,
            },
        },
        approvedBy: {
            select: {
                id: true,
                name: true,
                email: true,
            },
        },
        _count: {
            select: {
                attachedDocuments: true,
            },
        },
    });
}
exports.default = new AllocationRepository();
