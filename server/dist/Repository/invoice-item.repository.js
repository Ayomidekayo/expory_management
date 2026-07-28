"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
class InvoiceItemRepository {
    /*
    =====================================
    Shared Include
    =====================================
    */
    include = {
        invoice: true,
    };
    /*
    =====================================
    Create
    =====================================
    */
    async create(invoiceId, data, total) {
        return prisma_1.prisma.invoiceItem.create({
            data: {
                invoiceId,
                description: data.description,
                hsCode: data.hsCode,
                packageType: data.packageType,
                packages: data.packages,
                grossWeight: data.grossWeight,
                netWeight: data.netWeight,
                quantity: data.quantity,
                unit: data.unit,
                unitPrice: data.unitPrice,
                remarks: data.remarks,
                total,
            },
            include: this.include,
        });
    }
    /*
    =====================================
    Find By Invoice
    =====================================
    */
    async findByInvoice(invoiceId) {
        return prisma_1.prisma.invoiceItem.findMany({
            where: {
                invoiceId,
            },
            include: this.include,
            orderBy: {
                createdAt: "asc",
            },
        });
    }
    /*
    =====================================
    Find By Id
    =====================================
    */
    async findById(id) {
        return prisma_1.prisma.invoiceItem.findUnique({
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
    async update(id, data, total) {
        return prisma_1.prisma.invoiceItem.update({
            where: {
                id,
            },
            data: {
                ...data,
                total,
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
        return prisma_1.prisma.invoiceItem.delete({
            where: {
                id,
            },
            include: this.include,
        });
    }
    /*
    =====================================
    Update Invoice Total
    =====================================
    */
    async updateInvoiceTotal(invoiceId) {
        const items = await prisma_1.prisma.invoiceItem.findMany({
            where: {
                invoiceId,
            },
            select: {
                total: true,
            },
        });
        const totalAmount = items.reduce((sum, item) => sum + Number(item.total), 0);
        return prisma_1.prisma.invoice.update({
            where: {
                id: invoiceId,
            },
            data: {
                totalAmount,
            },
        });
    }
}
exports.default = new InvoiceItemRepository();
