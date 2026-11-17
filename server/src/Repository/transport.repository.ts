



import { Prisma } from "../generated";
import { prisma } from "../config/prisma";
import { TransportQuery } from "../validations/transport-query.validation";
import {
  CreateTransportDto,
  UpdateTransportDto,
  UpdateTransportItemDto,
} from "../validations/transport.validation";

class TransportRepository {
  private prepareItemData(item: UpdateTransportItemDto) {
    const commonData = {
      itemDate: new Date(item.itemDate),
      itemType: item.itemType,
      name: item.name ?? null,
      chargeAmount: new Prisma.Decimal(item.chargeAmount),
      chargeCurrency: item.chargeCurrency,
      remarks: item.remarks ?? null,
    };

    if (item.itemType === "TRUCK") {
      return {
        ...commonData,
        frontPlateNumber: item.frontPlateNumber || null,
        backPlateNumber: item.backPlateNumber || null,
        containerName: null,
        containerNumber: null,
      };
    }

    return {
      ...commonData,
      frontPlateNumber: null,
      backPlateNumber: null,
      containerName: item.containerName || null,
      containerNumber: item.containerNumber || null,
    };
  }

  /* CREATE */
  async create(data: CreateTransportDto & { transportNumber: string }) {
    const { items, transportDate, ...transportData } = data;

    return prisma.$transaction(async (tx) =>
      tx.transport.create({
        data: {
          ...transportData,
          transportDate: new Date(transportDate),
          items: {
            create: items.map((item) => this.prepareItemData(item)),
          },
        },
        include: this.detailsInclude,
      }),
    );
  }

  async findLatestTransport() {
    return prisma.transport.findFirst({
      orderBy: { createdAt: "desc" },
      select: { transportNumber: true },
    });
  }

  /* LIST */
  async findAll(query: TransportQuery) {
    const { page, limit, search, shipmentId, sortBy, sortOrder } = query;

    const searchFilter: Prisma.TransportWhereInput = search?.trim()
      ? {
          OR: [
            {
              transportNumber: {
                contains: search.trim(),
                mode: "insensitive",
              },
            },
            {
              ownerName: {
                contains: search.trim(),
                mode: "insensitive",
              },
            },
            {
              shipment: {
                is: {
                  shipmentNumber: {
                    contains: search.trim(),
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              items: {
                some: {
                  OR: [
                    { name: { contains: search.trim(), mode: "insensitive" } },
                    { frontPlateNumber: { contains: search.trim(), mode: "insensitive" } },
                    { backPlateNumber: { contains: search.trim(), mode: "insensitive" } },
                    { containerName: { contains: search.trim(), mode: "insensitive" } },
                    { containerNumber: { contains: search.trim(), mode: "insensitive" } },
                  ],
                },
              },
            },
          ],
        }
      : {};

    const where: Prisma.TransportWhereInput = {
      ...(shipmentId ? { shipmentId } : {}),
      ...searchFilter,
    };

    const [data, total] = await Promise.all([
      prisma.transport.findMany({
        where,
        include: this.listInclude,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transport.count({ where }),
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

  async findItemForLock(itemId: string) {
    return prisma.transportItem.findUnique({
      where: { id: itemId },
      select: {
        id: true,
        isLocked: true,
        lockedAt: true,
        transport: { select: { id: true, isLocked: true } },
      },
    });
  }

  async updateItemLock(itemId: string, isLocked: boolean) {
    return prisma.$transaction(async (tx) => {
      const item = await tx.transportItem.findUnique({
        where: { id: itemId },
        select: { id: true, transport: { select: { isLocked: true } } },
      });

      if (!item) throw new Error("Transport item not found.");
      if (item.transport.isLocked) {
        throw new Error("Cannot lock or unlock an item while its parent transport is locked.");
      }

      return tx.transportItem.update({
        where: { id: itemId },
        data: { isLocked, lockedAt: isLocked ? new Date() : null },
        include: {
          payments: { orderBy: { paymentDate: "desc" } },
        },
      });
    });
  }

  /* DETAILS */
  async findById(id: string) {
    return prisma.transport.findUnique({
      where: { id },
      include: this.detailsInclude,
    });
  }

  async findByShipmentId(shipmentId: string) {
    return prisma.transport.findFirst({
      where: { shipmentId },
      include: this.detailsInclude,
    });
  }

  /* UPDATE PARENT AND ITEMS ATOMICALLY */
  async update(id: string, data: UpdateTransportDto, userId?: string) {
    const { items, transportDate, ...transportData } = data;

    return prisma.$transaction(async (tx) => {
      await tx.transport.update({
        where: { id },
        data: {
          ...transportData,
          ...(transportDate !== undefined ? { transportDate: new Date(transportDate) } : {}),
          ...(userId ? { updatedById: userId } : {}),
        },
      });

      if (items !== undefined) {
        for (const item of items) {
          const { id: itemId } = item;
          const preparedData = this.prepareItemData(item);

          if (itemId) {
            const existingItem = await tx.transportItem.findFirst({
              where: { id: itemId, transportId: id },
              include: { payments: true },
            });

            if (!existingItem) {
              throw new Error("Transport item does not belong to this transport.");
            }
            if (existingItem.isLocked) {
              throw new Error("This Transport item is locked.");
            }

            const totalPaid = existingItem.payments.reduce(
              (total, payment) => total.plus(payment.amount),
              new Prisma.Decimal(0),
            );
            const newCharge = new Prisma.Decimal(preparedData.chargeAmount);

            if (newCharge.lessThan(totalPaid)) {
              throw new Error("Charge amount cannot be less than the total paid amount.");
            }
            if (
              existingItem.payments.length > 0 &&
              preparedData.chargeCurrency !== existingItem.chargeCurrency
            ) {
              throw new Error("Currency cannot be changed after payments have been recorded.");
            }

            const paymentStatus =
              newCharge.greaterThan(0) && totalPaid.greaterThanOrEqualTo(newCharge)
                ? "PAID"
                : totalPaid.equals(0)
                  ? "UNPAID"
                  : existingItem.payments.some((payment) => payment.paymentType === "REGULAR")
                    ? "PARTIALLY_PAID"
                    : "ADVANCE";

            await tx.transportItem.update({
              where: { id: itemId },
              data: { ...preparedData, paymentStatus },
            });
          } else {
            await tx.transportItem.create({
              data: {
                ...preparedData,
                paymentStatus: "UNPAID",
                transportId: id,
              },
            });
          }
        }
      }

      return tx.transport.findUniqueOrThrow({
        where: { id },
        include: this.detailsInclude,
      });
    });
  }

async delete(id: string) {
  return prisma.$transaction(async (tx) => {
    // Fetch the record before deletion so the existing response shape is preserved.
    const transport = await tx.transport.findUnique({
      where: { id },
      include: this.detailsInclude,
    });

    if (!transport) {
      throw new Error("TRANSPORT_NOT_FOUND");
    }

    const itemIds = transport.items.map((item) => item.id);

    // The payment FK uses Restrict, so remove dependent payments first.
    if (itemIds.length > 0) {
      await tx.transportPayment.deleteMany({
        where: {
          transportItemId: { in: itemIds },
        },
      });

      // Then remove the child items.
      await tx.transportItem.deleteMany({
        where: { transportId: id },
      });
    }

    // Finally remove the parent Transport record.
    await tx.transport.delete({
      where: { id },
    });

    return transport;
  });
}

  private listInclude = {
    shipment: {
      select: {
        id: true,
        shipmentNumber: true,
        shipmentDate: true,
        client: { select: { id: true, companyName: true } },
      },
    },
    items: {
      select: {
        chargeAmount: true,
        chargeCurrency: true,
      },
    },
    _count: { select: { items: true } },
  } satisfies Prisma.TransportInclude;

  private detailsInclude = {
    shipment: {
      select: {
        id: true,
        shipmentNumber: true,
        shipmentDate: true,
        client: { select: { id: true, companyName: true } },
      },
    },
    items: {
      orderBy: { createdAt: Prisma.SortOrder.asc },
      include: {
        payments: {
          orderBy: { paymentDate: Prisma.SortOrder.desc },
        },
      },
    },
    _count: { select: { items: true } },
  } satisfies Prisma.TransportInclude;

  async findColumnLocks() {
    return prisma.transportItemColumnLock.findMany({
      orderBy: { columnKey: "asc" },
    });
  }

  async findLockedColumnKeys() {
    const locks = await prisma.transportItemColumnLock.findMany({
      where: { isLocked: true },
      select: { columnKey: true },
    });
    return locks.map((lock) => lock.columnKey);
  }

  async updateColumnLock(
    columnKey: string,
    data: { isLocked: boolean; lockedById?: string; lockReason?: string | null },
  ) {
    return prisma.transportItemColumnLock.upsert({
      where: { columnKey },
      create: {
        columnKey,
        isLocked: data.isLocked,
        lockedAt: data.isLocked ? new Date() : null,
        lockedById: data.isLocked ? data.lockedById : null,
        lockReason: data.isLocked ? data.lockReason : null,
      },
      update: {
        isLocked: data.isLocked,
        lockedAt: data.isLocked ? new Date() : null,
        lockedById: data.isLocked ? data.lockedById : null,
        lockReason: data.isLocked ? data.lockReason : null,
      },
    });
  }
}

export default new TransportRepository();
