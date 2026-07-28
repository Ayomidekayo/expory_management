"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
class DocumentRepository {
    /*
    =====================================
    Create
    =====================================
    */
    async create(data) {
        return prisma_1.prisma.document.create({
            data: {
                type: data.type,
                fileName: data.fileName,
                fileUrl: data.fileUrl,
                mimeType: data.mimeType,
                fileSize: data.fileSize,
                remarks: data.remarks,
                shipmentId: data.shipmentId,
                containerId: data.containerId,
                packingListId: data.packingListId,
                invoiceId: data.invoiceId,
                transitId: data.transitId,
                allocationId: data.allocationId,
            },
            include: this.detailsInclude,
        });
    }
    /*
    =====================================
    Find All
    =====================================
    */
    async findAll(query) {
        const { page, limit, search, shipmentId, containerId, packingListId, invoiceId, transitId, type, sortBy, sortOrder, } = query;
        const where = {
            ...(shipmentId && {
                shipmentId,
            }),
            ...(containerId && {
                containerId,
            }),
            ...(packingListId && {
                packingListId,
            }),
            ...(invoiceId && {
                invoiceId,
            }),
            ...(transitId && {
                transitId,
            }),
            ...(type && {
                type,
            }),
            ...(search && {
                OR: [
                    {
                        fileName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        remarks: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            prisma_1.prisma.document.findMany({
                where,
                include: this.listInclude,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma_1.prisma.document.count({
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
        console.log("REPOSITORY FIND:", id);
        return prisma_1.prisma.document.findUnique({
            where: {
                id,
            },
            include: this.detailsInclude,
        });
    }
    /*
    =====================================
    Update
    =====================================
    */
    async update(id, data) {
        return prisma_1.prisma.document.update({
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
        return prisma_1.prisma.document.delete({
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
            },
        },
        container: {
            select: {
                id: true,
                containerNumber: true,
            },
        },
        packingList: {
            select: {
                id: true,
                packingListNumber: true,
            },
        },
        invoice: {
            select: {
                id: true,
                invoiceNumber: true,
            },
        },
        transit: {
            select: {
                id: true,
                transitNumber: true,
            },
        },
    };
    /*
    =====================================
    DETAILS INCLUDE
    =====================================
    */
    detailsInclude = {
        allocation: {
            select: {
                id: true,
                allocationNumber: true,
            },
        },
        shipment: true,
        container: true,
        packingList: true,
        invoice: true,
        transit: true,
    };
}
exports.default = new DocumentRepository();
