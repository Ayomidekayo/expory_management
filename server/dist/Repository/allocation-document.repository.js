"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
class AllocationDocumentRepository {
    create(data) {
        return prisma_1.prisma.allocationDocument.create({
            data,
        });
    }
    findByAllocation(allocationId) {
        return prisma_1.prisma.allocationDocument.findMany({
            where: { allocationId },
            orderBy: { uploadedAt: "desc" },
        });
    }
    async findById(id) {
        return prisma_1.prisma.allocationDocument.findUnique({
            where: { id },
        });
    }
    async delete(id) {
        return prisma_1.prisma.allocationDocument.delete({
            where: { id },
        });
    }
}
exports.default = new AllocationDocumentRepository();
