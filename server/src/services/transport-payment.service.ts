import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/ApiError";

import type { CreateTransportPaymentDto } from "../validations/transport-payment.validation";
import { transportPaymentRepository } from "../Repository/transport-payment.repository";

export const transportPaymentService = {
  async findPayments(itemId: string) {
    const item =
      await transportPaymentRepository.findItemWithPayments(itemId);

    if (!item) {
      throw new ApiError(404, "Transport item not found.");
    }

    const totalPaid = item.payments.reduce(
      (total, payment) => total.plus(payment.amount),
      new Prisma.Decimal(0),
    );

    const balance = item.chargeAmount.minus(totalPaid);

    return {
      payments: item.payments,
      summary: {
        chargeAmount: item.chargeAmount,
        totalPaid,
        balance,
        paymentStatus: item.paymentStatus,
        currency: item.chargeCurrency,
      },
    };
  },

  async createPayment(
    itemId: string,
    payload: CreateTransportPaymentDto,
    recordedById?: string,
  ) {
    const item =
      await transportPaymentRepository.findItemWithPayments(itemId);

    if (!item) {
      throw new ApiError(404, "Transport item not found.");
    }

    if (item.isLocked || item.transport.isLocked) {
      throw new ApiError(400, "This transport item is locked.");
    }

    const paymentDate = payload.paymentDate
      ? new Date(payload.paymentDate)
      : new Date();

    if (Number.isNaN(paymentDate.getTime())) {
      throw new ApiError(400, "Invalid payment date.");
    }

    try {
      const updatedItem =
        await transportPaymentRepository.createPayment({
          itemId,
          recordedById,
          amount: new Prisma.Decimal(payload.amount),
          paymentType: payload.paymentType,
          paymentDate,
          paymentMethod: payload.paymentMethod,
          reference: payload.reference,
          description: payload.description,
          notes: payload.notes,
        });

      const totalPaid = updatedItem.payments.reduce(
        (total, payment) => total.plus(payment.amount),
        new Prisma.Decimal(0),
      );

      return {
        item: updatedItem,
        summary: {
          chargeAmount: updatedItem.chargeAmount,
          totalPaid,
          balance: updatedItem.chargeAmount.minus(totalPaid),
          paymentStatus: updatedItem.paymentStatus,
          currency: updatedItem.chargeCurrency,
        },
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;

      if (error instanceof Error) {
        throw new ApiError(400, error.message);
      }

      throw new ApiError(500, "Unable to record transport payment.");
    }
  },
};