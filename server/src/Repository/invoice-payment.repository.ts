import { prisma } from "../config/prisma";

import {
  CreateInvoicePaymentDto,
  UpdateInvoicePaymentDto,
} from "../validations/invoice-payment.validation";

class InvoicePaymentRepository {
  async create(data: CreateInvoicePaymentDto) {
    return prisma.invoicePayment.create({
      data: {
        invoiceId: data.invoiceId,

        invoiceItemId:
          data.invoiceItemId || null,

        amount: data.amount,

        description:
          data.description || null,

        paymentDate: new Date(
          data.paymentDate
        ),

        paymentMethod:
          data.paymentMethod || null,

        reference:
          data.reference || null,

        notes:
          data.notes || null,
      },

      include: {
        invoiceItem: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.invoicePayment.findUnique({
      where: { id },

      include: {
        invoiceItem: true,
      },
    });
  }

  async findByInvoiceId(invoiceId: string) {
    return prisma.invoicePayment.findMany({
      where: {
        invoiceId,
      },

      include: {
        invoiceItem: true,
      },

      orderBy: {
        paymentDate: "desc",
      },
    });
  }

  async update(
    id: string,
    data: UpdateInvoicePaymentDto
  ) {
    return prisma.invoicePayment.update({
      where: { id },

      data: {
        invoiceItemId:
          data.invoiceItemId || null,

        amount: data.amount,

        description:
          data.description || null,

        paymentDate: new Date(
          data.paymentDate
        ),

        paymentMethod:
          data.paymentMethod || null,

        reference:
          data.reference || null,

        notes:
          data.notes || null,
      },

      include: {
        invoiceItem: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.invoicePayment.delete({
      where: { id },
    });
  }
}

export default new InvoicePaymentRepository();