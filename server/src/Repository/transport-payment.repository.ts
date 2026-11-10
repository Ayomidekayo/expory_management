
import { prisma } from "../config/prisma";
import { Prisma } from "../generated";


const paymentInclude = {
  recordedBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

export const transportPaymentRepository = {
 async findItemWithPayments(itemId: string) {
  return prisma.transportItem.findUnique({
    where: {
      id: itemId,
    },
    include: {
      payments: {
        include: paymentInclude,
        orderBy: {
          paymentDate: "desc",
        },
      },
      transport: {
        select: {
          id: true,
          transportNumber: true,
          isLocked: true,
        },
      },
    },
  });
},

  async findPayments(itemId: string) {
  return prisma.transportPayment.findMany({
    where: {
      transportItemId: itemId,
    },
    include: paymentInclude,
    orderBy: {
      paymentDate: "desc",
    },
  });
},

  async createPayment(data: {
    itemId: string;
    recordedById?: string;
    amount: Prisma.Decimal;
    paymentType: "ADVANCE" | "REGULAR";
    paymentDate: Date;
    paymentMethod?: string;
    reference?: string;
    description?: string;
    notes?: string;
  }) {
    return prisma.$transaction(
      async (tx) => {
        const item = await tx.transportItem.findUnique({
          where: { id: data.itemId },
          include: {
            payments: true,
            transport: {
              select: {
                isLocked: true,
              },
            },
          },
        });

        if (!item) {
          throw new Error("Transport item not found.");
        }

        if (item.isLocked || item.transport.isLocked) {
          throw new Error("This transport item is locked.");
        }

        const totalPaid = item.payments.reduce(
          (total, payment) => total.plus(payment.amount),
          new Prisma.Decimal(0),
        );

        const outstanding = item.chargeAmount.minus(totalPaid);

        if (item.chargeAmount.lessThanOrEqualTo(0)) {
          throw new Error("Add a charge to this item before recording payment.");
        }

        if (data.amount.greaterThan(outstanding)) {
          throw new Error(
            `Payment exceeds the outstanding balance of ${outstanding.toString()}.`,
          );
        }

        const newTotalPaid = totalPaid.plus(data.amount);

        const hasRegularPayment =
          item.payments.some((payment) => payment.paymentType === "REGULAR") ||
          data.paymentType === "REGULAR";

        let paymentStatus:
          | "UNPAID"
          | "ADVANCE"
          | "PARTIALLY_PAID"
          | "PAID";

        if (newTotalPaid.greaterThanOrEqualTo(item.chargeAmount)) {
          paymentStatus = "PAID";
        } else if (hasRegularPayment) {
          paymentStatus = "PARTIALLY_PAID";
        } else {
          paymentStatus = "ADVANCE";
        }

        await tx.transportPayment.create({
          data: {
            transportItemId: data.itemId,
            recordedById: data.recordedById,
            amount: data.amount,
            paymentType: data.paymentType,
            paymentDate: data.paymentDate,
            paymentMethod: data.paymentMethod,
            reference: data.reference,
            description: data.description,
            notes: data.notes,
          },
        });

        await tx.transportItem.update({
          where: { id: data.itemId },
          data: { paymentStatus },
        });

        return tx.transportItem.findUniqueOrThrow({
          where: { id: data.itemId },
          include: {
            payments: {
              include: paymentInclude,
              orderBy: { paymentDate: "desc" },
            },
            transport: {
              select: {
                id: true,
                transportNumber: true,
                isLocked: true,
              },
            },
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  },
};