import {
  Prisma,
  InvoiceStatus,
} from "../generated";

import { prisma } from "../config/prisma";

import invoicePaymentRepository from "../Repository/invoice-payment.repository";

import {
  CreateInvoicePaymentDto,
  UpdateInvoicePaymentDto,
} from "../validations/invoice-payment.validation";

import { ApiError } from "../utils/ApiError";

class InvoicePaymentService {
  /*
  =====================================
  Calculate Invoice Payment Status
  =====================================
  */

  private async updateInvoicePaymentStatus(
    tx: Prisma.TransactionClient,
    invoiceId: string
  ) {
    const invoice =
      await tx.invoice.findUnique({
        where: {
          id: invoiceId,
        },

        select: {
          totalAmount: true,
        },
      });

    if (!invoice) {
      throw new ApiError(
        404,
        "Invoice not found."
      );
    }

    const paymentTotal =
      await tx.invoicePayment.aggregate({
        where: {
          invoiceId,
        },

        _sum: {
          amount: true,
        },
      });

    const totalPaid =
      Number(paymentTotal._sum.amount ?? 0);

    const invoiceTotal =
      Number(invoice.totalAmount);

    let status:
      | "UNPAID"
      | "PARTIALLY_PAID"
      | "PAID";

    if (totalPaid <= 0) {
      status = "UNPAID";
    } else if (totalPaid < invoiceTotal) {
      status = "PARTIALLY_PAID";
    } else {
      status = "PAID";
    }

    await tx.invoice.update({
      where: {
        id: invoiceId,
      },

      data: {
        status,
      },
    });

    return {
      totalPaid,
      outstandingBalance:
        Math.max(
          invoiceTotal - totalPaid,
          0
        ),
      status,
    };
  }

  /*
  =====================================
  Create Payment
  =====================================
  */

  async create(
    data: CreateInvoicePaymentDto
  ) {
    return prisma.$transaction(
      async (tx) => {
        const invoice =
          await tx.invoice.findUnique({
            where: {
              id: data.invoiceId,
            },

            select: {
              id: true,
              totalAmount: true,
            },
          });

        if (!invoice) {
          throw new ApiError(
            404,
            "Invoice not found."
          );
        }

        const currentPayments =
          await tx.invoicePayment.aggregate({
            where: {
              invoiceId: data.invoiceId,
            },

            _sum: {
              amount: true,
            },
          });

        const alreadyPaid =
          Number(
            currentPayments._sum.amount ?? 0
          );

        const newAmount =
          Number(data.amount);

        const invoiceTotal =
          Number(invoice.totalAmount);

        if (
          alreadyPaid + newAmount >
          invoiceTotal
        ) {
          throw new ApiError(
            400,
            `Payment exceeds the outstanding invoice balance of ${invoiceTotal - alreadyPaid}.`
          );
        }

        if (data.invoiceItemId) {
          const item =
            await tx.invoiceItem.findFirst({
              where: {
                id: data.invoiceItemId,
                invoiceId: data.invoiceId,
              },
            });

          if (!item) {
            throw new ApiError(
              400,
              "Selected invoice item does not belong to this invoice."
            );
          }
        }

        const payment =
          await tx.invoicePayment.create({
            data: {
              invoiceId:
                data.invoiceId,

              invoiceItemId:
                data.invoiceItemId ||
                null,

              amount: newAmount,

              description:
                data.description ||
                null,

              paymentDate: new Date(
                data.paymentDate
              ),

              paymentMethod:
                data.paymentMethod ||
                null,

              reference:
                data.reference ||
                null,

              notes:
                data.notes || null,
            },

            include: {
              invoiceItem: true,
            },
          });

        const summary =
          await this.updateInvoicePaymentStatus(
            tx,
            data.invoiceId
          );

        return {
          payment,
          summary,
        };
      }
    );
  }

  /*
  =====================================
  Find Payments
  =====================================
  */

  async findByInvoiceId(
    invoiceId: string
  ) {
    const invoice =
      await prisma.invoice.findUnique({
        where: {
          id: invoiceId,
        },
      });

    if (!invoice) {
      throw new ApiError(
        404,
        "Invoice not found."
      );
    }

    const payments =
      await invoicePaymentRepository.findByInvoiceId(
        invoiceId
      );

    const totalPaid =
      payments.reduce(
        (sum, payment) =>
          sum + Number(payment.amount),
        0
      );

    return {
      payments,

      summary: {
        invoiceTotal:
          Number(invoice.totalAmount),

        totalPaid,

        outstandingBalance:
          Math.max(
            Number(invoice.totalAmount) -
              totalPaid,
            0
          ),

        status: invoice.status,
      },
    };
  }




  /*
=====================================
Find Payment By ID
=====================================
*/

async findById(id: string) {
  const payment =
    await invoicePaymentRepository.findById(
      id
    );

  if (!payment) {
    throw new ApiError(
      404,
      "Payment not found."
    );
  }

  return payment;
}
  /*
  =====================================
  Update Payment
  =====================================
  */

  async update(
    id: string,
    data: UpdateInvoicePaymentDto
  ) {
    return prisma.$transaction(
      async (tx) => {
        const existing =
          await tx.invoicePayment.findUnique({
            where: { id },
          });

        if (!existing) {
          throw new ApiError(
            404,
            "Payment not found."
          );
        }

        const invoice =
          await tx.invoice.findUnique({
            where: {
              id: existing.invoiceId,
            },

            select: {
              totalAmount: true,
            },
          });

        if (!invoice) {
          throw new ApiError(
            404,
            "Invoice not found."
          );
        }

        const otherPayments =
          await tx.invoicePayment.aggregate({
            where: {
              invoiceId:
                existing.invoiceId,

              NOT: {
                id,
              },
            },

            _sum: {
              amount: true,
            },
          });

        const otherPaid =
          Number(
            otherPayments._sum.amount ?? 0
          );

        if (
          otherPaid + Number(data.amount) >
          Number(invoice.totalAmount)
        ) {
          throw new ApiError(
            400,
            "Payment exceeds the outstanding invoice balance."
          );
        }

        if (data.invoiceItemId) {
          const item =
            await tx.invoiceItem.findFirst({
              where: {
                id: data.invoiceItemId,
                invoiceId:
                  existing.invoiceId,
              },
            });

          if (!item) {
            throw new ApiError(
              400,
              "Selected invoice item does not belong to this invoice."
            );
          }
        }

        const payment =
          await tx.invoicePayment.update({
            where: { id },

            data: {
              invoiceItemId:
                data.invoiceItemId ||
                null,

              amount:
                Number(data.amount),

              description:
                data.description ||
                null,

              paymentDate:
                new Date(
                  data.paymentDate
                ),

              paymentMethod:
                data.paymentMethod ||
                null,

              reference:
                data.reference ||
                null,

              notes:
                data.notes || null,
            },

            include: {
              invoiceItem: true,
            },
          });

        const summary =
          await this.updateInvoicePaymentStatus(
            tx,
            existing.invoiceId
          );

        return {
          payment,
          summary,
        };
      }
    );
  }

  /*
  =====================================
  Delete Payment
  =====================================
  */

  async delete(id: string) {
    return prisma.$transaction(
      async (tx) => {
        const payment =
          await tx.invoicePayment.findUnique({
            where: { id },
          });

        if (!payment) {
          throw new ApiError(
            404,
            "Payment not found."
          );
        }

        await tx.invoicePayment.delete({
          where: { id },
        });

        const summary =
          await this.updateInvoicePaymentStatus(
            tx,
            payment.invoiceId
          );

        return {
          summary,
        };
      }
    );
  }
}

export default new InvoicePaymentService();