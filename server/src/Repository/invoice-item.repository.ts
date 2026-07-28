import { prisma } from "../config/prisma";

import {
  CreateInvoiceItemDto,
  UpdateInvoiceItemDto,
} from "../validations/invoice-item.validation";

class InvoiceItemRepository {
  /*
  =====================================
  Shared Include
  =====================================
  */

  private include = {
    invoice: true,
  };

  /*
  =====================================
  Create
  =====================================
  */

  async create(
    invoiceId: string,
    data: CreateInvoiceItemDto,
    total: number
  ) {
    return prisma.invoiceItem.create({
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

  async findByInvoice(
    invoiceId: string
  ) {
    return prisma.invoiceItem.findMany({
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

  async findById(id: string) {
    return prisma.invoiceItem.findUnique({
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

  async update(
    id: string,
    data: UpdateInvoiceItemDto,
    total: number
  ) {
    return prisma.invoiceItem.update({
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

  async delete(id: string) {
    return prisma.invoiceItem.delete({
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

  async updateInvoiceTotal(
    invoiceId: string
  ) {
    const items =
      await prisma.invoiceItem.findMany({
        where: {
          invoiceId,
        },

        select: {
          total: true,
        },
      });

    const totalAmount =
      items.reduce(
        (sum, item) =>
          sum + Number(item.total),
        0
      );

    return prisma.invoice.update({
      where: {
        id: invoiceId,
      },

      data: {
        totalAmount,
      },
    });
  }
}

export default new InvoiceItemRepository();