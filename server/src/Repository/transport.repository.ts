
import { Prisma } from "../generated";

import { prisma } from "../config/prisma";

import {
  TransportQuery,
} from "../validations/transport-query.validation";

import {
  CreateTransportDto,
  UpdateTransportDto,
} from "../validations/transport.validation";

class TransportRepository {
  /* ===========================================
     CREATE
  =========================================== */

  async create(
    data: CreateTransportDto & {
      transportNumber: string;
    },
  ) {
    const {
      items,
      transportDate,
      ...transportData
    } = data;

    return prisma.$transaction(async (tx) => {
      return tx.transport.create({
        data: {
          ...transportData,

          transportDate: new Date(transportDate),

          items: {
            create: items.map((item) => ({
              ...item,
              itemDate: new Date(item.itemDate),
            })),
          },
        },

        include: this.detailsInclude,
      });
    });
  }

  /* ===========================================
     FIND LATEST TRANSPORT
  =========================================== */

  async findLatestTransport() {
    return prisma.transport.findFirst({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        transportNumber: true,
      },
    });
  }

  /* ===========================================
     FIND ALL
  =========================================== */

  async findAll(query: TransportQuery) {
    const {
      page,
      limit,
      search,
      shipmentId,
      sortBy,
      sortOrder,
    } = query;

    const searchFilter: Prisma.TransportWhereInput =
      search
        ? {
            OR: [
              {
                transportNumber: {
                  contains: search,
                  mode: "insensitive",
                },
              },

              {
                shipment: {
                  shipmentNumber: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },

              {
                items: {
                  some: {
                    OR: [
                      {
                        ownerName: {
                          contains: search,
                          mode: "insensitive",
                        },
                      },

                      {
                        frontPlateNumber: {
                          contains: search,
                          mode: "insensitive",
                        },
                      },

                      {
                        backPlateNumber: {
                          contains: search,
                          mode: "insensitive",
                        },
                      },

                      {
                        containerNumber: {
                          contains: search,
                          mode: "insensitive",
                        },
                      },
                    ],
                  },
                },
              },
            ],
          }
        : {};

    const where: Prisma.TransportWhereInput = {
      ...(shipmentId && {
        shipmentId,
      }),

      ...searchFilter,
    };

    const [data, total] = await Promise.all([
      prisma.transport.findMany({
        where,

        include: this.listInclude,

        orderBy: {
          [sortBy]: sortOrder,
        },

        skip: (page - 1) * limit,

        take: limit,
      }),

      prisma.transport.count({
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

  
/* ===========================================
   FIND ITEM FOR LOCK / UNLOCK
=========================================== */

async findItemForLock(itemId: string) {
  return prisma.transportItem.findUnique({
    where: {
      id: itemId,
    },
    select: {
      id: true,
      isLocked: true,
      lockedAt: true,
      transport: {
        select: {
          id: true,
          isLocked: true,
        },
      },
    },
  });
}

/* ===========================================
   UPDATE ITEM LOCK
=========================================== */

async updateItemLock(
  itemId: string,
  isLocked: boolean,
) {
  return prisma.$transaction(async (tx) => {
    const item = await tx.transportItem.findUnique({
      where: {
        id: itemId,
      },
      select: {
        id: true,
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

    if (item.transport.isLocked) {
      throw new Error(
        "Cannot lock or unlock an item while its parent transport is locked.",
      );
    }

    return tx.transportItem.update({
      where: {
        id: itemId,
      },
      data: {
        isLocked,
        lockedAt: isLocked ? new Date() : null,
      },
      include: {
        payments: {
          orderBy: {
            paymentDate: "desc",
          },
        },
      },
    });
  });
}


  /* ===========================================
     FIND BY ID
  =========================================== */

  async findById(id: string) {
    return prisma.transport.findUnique({
      where: {
        id,
      },

      include: this.detailsInclude,
    });
  }

  /* ===========================================
     FIND BY SHIPMENT
  =========================================== */

  async findByShipmentId(shipmentId: string) {
    return prisma.transport.findFirst({
      where: {
        shipmentId,
      },

      include: this.detailsInclude,
    });
  }

  /* ===========================================
     UPDATE
  =========================================== */

 /* ===========================================
   UPDATE
=========================================== */

async update(
  id: string,
  data: UpdateTransportDto,
  userId?: string,
) {
  const {
    items,
    transportDate,
    ...transportData
  } = data;

  return prisma.$transaction(async (tx) => {
    await tx.transport.update({
      where: { id },
      data: {
        ...transportData,

        ...(transportDate !== undefined && {
          transportDate: new Date(transportDate),
        }),

        ...(userId && {
          updatedById: userId,
        }),
      },
    });

    // Keep your existing item update/create logic here.

    return tx.transport.findUniqueOrThrow({
      where: { id },
      include: this.detailsInclude,
    });
  });
}

  /* ===========================================
     DELETE
  =========================================== */

  async delete(id: string) {
    return prisma.transport.delete({
      where: {
        id,
      },

      include: this.detailsInclude,
    });
  }

  /* ===========================================
     LIST INCLUDE
  =========================================== */

  private  listInclude = {
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
    },
  },

  _count: {
    select: {
      items: true,
    },
  },
};

  /* ===========================================
     DETAILS INCLUDE
  =========================================== */

  private detailsInclude = {
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
        },
      },
    },

    _count: {
      select: {
        items: true,
      },
    },
  };

  /* ===========================================
   GET GLOBAL COLUMN LOCKS
=========================================== */

async findColumnLocks() {
  return prisma.transportItemColumnLock.findMany({
    orderBy: {
      columnKey: "asc",
    },
  });
}

/* ===========================================
   GET LOCKED COLUMN KEYS
=========================================== */

async findLockedColumnKeys() {
  const locks = await prisma.transportItemColumnLock.findMany({
    where: {
      isLocked: true,
    },
    select: {
      columnKey: true,
    },
  });

  return locks.map((lock) => lock.columnKey);
}

/* ===========================================
   UPDATE GLOBAL COLUMN LOCK
=========================================== */

async updateColumnLock(
  columnKey: string,
  data: {
    isLocked: boolean;
    lockedById?: string;
    lockReason?: string | null;
  },
) {
  return prisma.transportItemColumnLock.upsert({
    where: {
      columnKey,
    },

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
