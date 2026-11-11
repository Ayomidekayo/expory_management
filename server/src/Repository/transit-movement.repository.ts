
import { Prisma } from "../generated";
import { prisma } from "../config/prisma";

import {
  TransitMovementQuery,
} from "../validations/transit-movement-query.validation";

import {
  CreateTransitMovementDto,
  UpdateTransitMovementDto,
  TransitMovementItemDto,
} from "../validations/transit-movement.validation";

class TransitMovementRepository {



  

private buildWhere(
  query: TransitMovementQuery,
): Prisma.TransitMovementWhereInput {
  const {
    search,
    direction,
    clientName,
    shipmentId,
    association,
    fromDate,
    toDate,
    isLocked,
  } = query;

  const conditions: Prisma.TransitMovementWhereInput[] = [];

  // FILTER BY DIRECTION
  if (direction) {
    conditions.push({
      direction,
    });
  }

  // FILTER BY SHIPMENT
  if (shipmentId) {
    conditions.push({
      shipmentId,
    });
  }

  // FILTER BY SHIPMENT ASSOCIATION
  if (association === "LINKED") {
    conditions.push({
      shipmentId: {
        not: null,
      },
    });
  }

  if (association === "INDEPENDENT") {
    conditions.push({
      shipmentId: null,
    });
  }

  // FILTER BY RECORD LOCK STATUS
  if (isLocked !== undefined) {
    conditions.push({
      isLocked: isLocked === "true",
    });
  }

  // FILTER BY MOVEMENT DATE
  if (fromDate || toDate) {
    const dateFilter: Prisma.DateTimeFilter = {};

    if (fromDate) {
      dateFilter.gte = fromDate;
    }

    if (toDate) {
      const endDate = new Date(toDate);

      // Include the entire selected end date.
      endDate.setUTCHours(0, 0, 0, 0);
      endDate.setUTCDate(endDate.getUTCDate() + 1);

      dateFilter.lt = endDate;
    }

    conditions.push({
      transitDate: dateFilter,
    });
  }

  // FILTER BY CLIENT NAME
  if (clientName?.trim()) {
    conditions.push({
      items: {
        some: {
          clientName: {
            contains: clientName.trim(),
            mode: "insensitive",
          },
        },
      },
    });
  }

  // GENERAL SEARCH
  if (search?.trim()) {
    const searchTerm = search.trim();

    conditions.push({
      OR: [
        // Movement number
        {
          transitNumber: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },

        // Shipment number
        {
          shipment: {
            is: {
              shipmentNumber: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },

        // Shipment client/company name
        {
          shipment: {
            is: {
              client: {
                is: {
                  companyName: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        },

        // Movement item client name
        {
          items: {
            some: {
              clientName: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },

        // Item name
        {
          items: {
            some: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },

        // Truck front plate
        {
          items: {
            some: {
              frontPlateNumber: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },

        // Truck back plate
        {
          items: {
            some: {
              backPlateNumber: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },

        // Container name
        {
          items: {
            some: {
              containerName: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },

        // Container number
        {
          items: {
            some: {
              containerNumber: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }

  return conditions.length > 0
    ? {
        AND: conditions,
      }
    : {};
}


  /* =========================================
     SHARED INCLUDE: LIST
  ========================================= */

  private readonly listInclude = {
    shipment: {
      select: {
        id: true,
        shipmentNumber: true,
        shipmentDate: true,
        client: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    },

    items: {
      select: {
        chargeAmount: true,
        chargeCurrency: true,
        paymentStatus: true,
      },
    },

    _count: {
      select: {
        items: true,
      },
    },
  } satisfies Prisma.TransitMovementInclude;

  /* =========================================
     SHARED INCLUDE: DETAILS
  ========================================= */

  private readonly detailsInclude = {
    shipment: {
      select: {
        id: true,
        shipmentNumber: true,
        shipmentDate: true,
        client: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    },

    items: {
      orderBy: {
        createdAt: Prisma.SortOrder.asc,
      },

      include: {
        payments: {
          orderBy: {
            paymentDate: Prisma.SortOrder.desc,
          },

          include: {
            recordedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    },

    _count: {
      select: {
        items: true,
      },
    },
  } satisfies Prisma.TransitMovementInclude;

  /* =========================================
     NORMALIZE ITEM DATA
     
     Remove fields that do not apply to the
     selected item type.
  ========================================= */

  private prepareItemData(
    item: TransitMovementItemDto,
  ) {
    const {
      id: _itemId,
      itemType,
      itemDate,
      frontPlateNumber,
      backPlateNumber,
      containerName,
      containerNumber,
      ...commonData
    } = item;

    const baseData = {
      ...commonData,
      itemDate: new Date(itemDate),
      itemType,
    };

    if (itemType === "TRUCK") {
      return {
        ...baseData,
        frontPlateNumber: frontPlateNumber || null,
        backPlateNumber: backPlateNumber || null,
        containerName: null,
        containerNumber: null,
      };
    }

    return {
      ...baseData,
      frontPlateNumber: null,
      backPlateNumber: null,
      containerName,
      containerNumber,
    };
  }

  /* =========================================
     CREATE
  ========================================= */

async create(
  data: CreateTransitMovementDto & {
    transitNumber: string;
  },
) {
  const {
    items,
    transitDate,
    direction,
    shipmentId,
    remarks,
    transitNumber,
  } = data;

  return prisma.$transaction(
    async (tx) => {
      return tx.transitMovement.create({
        data: {
          transitNumber,
          transitDate: new Date(transitDate),
          direction,
          shipmentId: shipmentId ?? null,
          remarks: remarks ?? null,

          items: {
            create: items.map((item) =>
              this.prepareItemData(item),
            ),
          },
        },

        include: this.detailsInclude,
      });
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );
}

  /* =========================================
     FIND LATEST MOVEMENT BY DIRECTION
  ========================================= */

  async findLatestMovement(direction: "IN" | "OUT") {
    return prisma.transitMovement.findFirst({
      where: {
        direction,
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        transitNumber: true,
        direction: true,
        createdAt: true,
      },
    });
  }

  /* =========================================
     FIND ALL
  ========================================= */


async findAll(query: TransitMovementQuery) {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
  } = query;

  // Build all database filters in one place.
  const where = this.buildWhere(query);

  // Fetch records and total count using the same filters.
  const [data, total] = await prisma.$transaction([
    prisma.transitMovement.findMany({
      where,

      include: this.listInclude,

      orderBy: {
        [sortBy]: sortOrder,
      },

      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.transitMovement.count({
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


  /* =========================================
     FIND BY ID
  ========================================= */

  async findById(id: string) {
    return prisma.transitMovement.findUnique({
      where: { id },
      include: this.detailsInclude,
    });
  }

  /* =========================================
     FIND BY SHIPMENT
  ========================================= */

  async findByShipmentId(shipmentId: string) {
    return prisma.transitMovement.findMany({
      where: { shipmentId },

      include: this.detailsInclude,

      orderBy: {
        transitDate: "desc",
      },
    });
  }

  /* =========================================
     UPDATE
     
     Existing items are updated.
     Items without IDs are created.
     Missing items are NOT deleted.
  ========================================= */

  async update(
    id: string,
    data: UpdateTransitMovementDto,
  ) {
    const {
      items,
      transitDate,
      shipmentId,
      remarks,
    } = data;

    return prisma.$transaction(async (tx) => {
      // Update the parent record.
      await tx.transitMovement.update({
        where: { id },

        data: {
          ...(transitDate !== undefined && {
            transitDate: new Date(transitDate),
          }),

          ...(shipmentId !== undefined && {
            shipmentId,
          }),

          ...(remarks !== undefined && {
            remarks,
          }),
        },
      });

      // Update or create submitted items.
      if (items !== undefined) {
        for (const item of items) {
          const {
            id: itemId,
          } = item;

          const preparedData =
            this.prepareItemData(item);

          if (itemId) {
            // Ownership and existence check.
            const existingItem =
              await tx.transitMovementItem.findFirst({
                where: {
                  id: itemId,
                  transitMovementId: id,
                },

                include: {
                  payments: true,
                },
              });

            if (!existingItem) {
              throw new Error(
                "Transit Movement item does not belong to this movement.",
              );
            }

            if (existingItem.isLocked) {
              throw new Error(
                "This Transit Movement item is locked.",
              );
            }

            // Protect existing financial records.
            const totalPaid = existingItem.payments.reduce(
              (total, payment) =>
                total.plus(payment.amount),
              new Prisma.Decimal(0),
            );

            if (
              new Prisma.Decimal(preparedData.chargeAmount ?? 0)
                .lessThan(totalPaid)
            ) {
              throw new Error(
                `Charge amount cannot be less than the total paid amount for item ${itemId}.`,
              );
            }

            if (
              existingItem.payments.length > 0 &&
              existingItem.chargeCurrency !==
                preparedData.chargeCurrency
            ) {
              throw new Error(
                "Currency cannot be changed after payments have been recorded.",
              );
            }

            await tx.transitMovementItem.update({
              where: {
                id: itemId,
              },

              data: preparedData,
            });
          } else {
            await tx.transitMovementItem.create({
              data: {
                ...preparedData,
                transitMovementId: id,
              },
            });
          }
        }
      }

      return tx.transitMovement.findUniqueOrThrow({
        where: { id },
        include: this.detailsInclude,
      });
    });
  }

  /* =========================================
     DELETE MOVEMENT
  ========================================= */

  async delete(id: string) {
    return prisma.transitMovement.delete({
      where: { id },
      include: this.detailsInclude,
    });
  }

  /* =========================================
     DELETE INDIVIDUAL ITEM
     
     Payment history is protected.
  ========================================= */

  async deleteItem(
    movementId: string,
    itemId: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const item =
        await tx.transitMovementItem.findFirst({
          where: {
            id: itemId,
            transitMovementId: movementId,
          },

          include: {
            payments: true,
            transitMovement: {
              select: {
                isLocked: true,
              },
            },
          },
        });

      if (!item) {
        throw new Error(
          "Transit Movement item not found.",
        );
      }

      if (item.transitMovement.isLocked) {
        throw new Error(
          "This Transit Movement is locked.",
        );
      }

      if (item.isLocked) {
        throw new Error(
          "This item is locked and cannot be deleted.",
        );
      }

      if (item.payments.length > 0) {
        throw new Error(
          "This item cannot be deleted because it has payment history.",
        );
      }

      return tx.transitMovementItem.delete({
        where: { id: itemId },
      });
    });
  }

  /* =========================================
     GET COLUMN LOCKS
  ========================================= */

  async findColumnLocks() {
    return prisma.transitMovementItemColumnLock.findMany({
      orderBy: {
        columnKey: "asc",
      },
    });
  }

  /* =========================================
     GET LOCKED COLUMN KEYS
  ========================================= */

  async findLockedColumnKeys() {
    const locks =
      await prisma.transitMovementItemColumnLock.findMany({
        where: {
          isLocked: true,
        },

        select: {
          columnKey: true,
        },
      });

    return locks.map((lock) => lock.columnKey);
  }

  /* =========================================
     UPDATE GLOBAL COLUMN LOCK
  ========================================= */

  async updateColumnLock(
    columnKey: string,
    data: {
      isLocked: boolean;
      lockedById?: string;
      lockReason?: string | null;
    },
  ) {
    return prisma.transitMovementItemColumnLock.upsert({
      where: {
        columnKey,
      },

      create: {
        columnKey,
        isLocked: data.isLocked,
        lockedAt: data.isLocked ? new Date() : null,
        lockedById: data.isLocked
          ? data.lockedById
          : null,
        lockReason: data.isLocked
          ? data.lockReason
          : null,
      },

      update: {
        isLocked: data.isLocked,
        lockedAt: data.isLocked ? new Date() : null,
        lockedById: data.isLocked
          ? data.lockedById
          : null,
        lockReason: data.isLocked
          ? data.lockReason
          : null,
      },
    });
  }


  
/* ===========================================
   GET TRANSIT MOVEMENT ITEM
=========================================== */

async findItemById(itemId: string) {
  return prisma.transitMovementItem.findUnique({
    where: { id: itemId },
    include: {
      transitMovement: true,
      payments: {
        orderBy: {
          paymentDate: "desc",
        },
        include: {
          recordedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

/* ===========================================
   GET ITEM PAYMENT HISTORY
=========================================== */

async findItemPayments(itemId: string) {
  return prisma.transitMovementPayment.findMany({
    where: {
      transitMovementItemId: itemId,
    },
    orderBy: {
      paymentDate: "desc",
    },
    include: {
      recordedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

/* ===========================================
   RECORD ITEM PAYMENT
=========================================== */

async createPayment(
  itemId: string,
  data: {
    amount: number;
    paymentType: "ADVANCE" | "REGULAR";
    paymentDate?: Date;
    paymentMethod?: string;
    reference?: string;
    description?: string;
    notes?: string;
    recordedById?: string;
  },
) {
  return prisma.$transaction(async (tx) => {
    const item = await tx.transitMovementItem.findUnique({
      where: { id: itemId },
      include: {
        transitMovement: true,
        payments: true,
      },
    });

    if (!item) {
      throw new Error("TRANSIT_MOVEMENT_ITEM_NOT_FOUND");
    }

    if (item.transitMovement.isLocked) {
      throw new Error("TRANSIT_MOVEMENT_LOCKED");
    }

    if (item.isLocked) {
      throw new Error("TRANSIT_MOVEMENT_ITEM_LOCKED");
    }

    const totalPaid = item.payments.reduce(
      (total, payment) => total.plus(payment.amount),
      new Prisma.Decimal(0),
    );

    const charge = new Prisma.Decimal(item.chargeAmount);
    const paymentAmount = new Prisma.Decimal(data.amount);
    const balance = charge.minus(totalPaid);

    if (charge.lessThanOrEqualTo(0)) {
      throw new Error("TRANSIT_MOVEMENT_NO_CHARGE");
    }

    if (paymentAmount.greaterThan(balance)) {
      throw new Error("TRANSIT_MOVEMENT_OVERPAYMENT");
    }

    const payment = await tx.transitMovementPayment.create({
      data: {
        transitMovementItemId: itemId,
        recordedById: data.recordedById,
        amount: paymentAmount,
        paymentType: data.paymentType,
        paymentDate: data.paymentDate ?? new Date(),
        paymentMethod: data.paymentMethod,
        reference: data.reference,
        description: data.description,
        notes: data.notes,
      },
      include: {
        recordedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const updatedPayments = [
      ...item.payments,
      payment,
    ];

    const updatedTotalPaid = updatedPayments.reduce(
      (total, current) => total.plus(current.amount),
      new Prisma.Decimal(0),
    );

    let paymentStatus:
      | "UNPAID"
      | "ADVANCE"
      | "PARTIALLY_PAID"
      | "PAID";

    if (updatedTotalPaid.greaterThanOrEqualTo(charge)) {
      paymentStatus = "PAID";
    } else if (
      updatedPayments.some(
        (current) => current.paymentType === "REGULAR",
      )
    ) {
      paymentStatus = "PARTIALLY_PAID";
    } else {
      paymentStatus = "ADVANCE";
    }

    await tx.transitMovementItem.update({
      where: { id: itemId },
      data: { paymentStatus },
    });

    return tx.transitMovementPayment.findUniqueOrThrow({
      where: { id: payment.id },
      include: {
        recordedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  });
}

/* ===========================================
   LOCK / UNLOCK ITEM
=========================================== */

async updateItemLock(
  itemId: string,
  isLocked: boolean,
) {
  return prisma.$transaction(async (tx) => {
    const item = await tx.transitMovementItem.findUnique({
      where: { id: itemId },
      include: {
        transitMovement: true,
      },
    });

    if (!item) {
      throw new Error("TRANSIT_MOVEMENT_ITEM_NOT_FOUND");
    }

    if (item.transitMovement.isLocked) {
      throw new Error("TRANSIT_MOVEMENT_LOCKED");
    }

    return tx.transitMovementItem.update({
      where: { id: itemId },
      data: {
        isLocked,
        lockedAt: isLocked ? new Date() : null,
      },
    });
  });
}

}

export default new TransitMovementRepository();
