import { Prisma, PrismaClient } from "../generated";
import { CreateTransporterDto, transporterInclude, TransporterQuery, TransporterWithRelations } from "../types/transporter.types";


export class TransporterRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(query: TransporterQuery) {
    const {
      page,
      limit,
      search,
      shipmentId,
      status,
      itemType,
      sortBy,
      sortOrder,
    } = query;

    const conditions: Prisma.TransporterWhereInput[] = [];

    if (shipmentId) {
      conditions.push({ shipmentId });
    }

    if (search) {
      conditions.push({
        OR: [
          {
            transportNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            truckOwnerName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            shipment: {
              is: {
                shipmentNumber: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            items: {
              some: {
                OR: [
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
                  {
                    name: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            },
          },
        ],
      });
    }

    if (status || itemType) {
      const itemFilter: Prisma.TransporterItemWhereInput = {};

      if (status) {
        itemFilter.status = status;
      }

      if (itemType) {
        itemFilter.itemType = itemType;
      }

      conditions.push({
        items: {
          some: itemFilter,
        },
      });
    }

    const where: Prisma.TransporterWhereInput =
      conditions.length > 0
        ? { AND: conditions }
        : {};

    let orderBy: Prisma.TransporterOrderByWithRelationInput;

    switch (sortBy) {
      case "transportDate":
        orderBy = { transportDate: sortOrder };
        break;

      case "transportNumber":
        orderBy = { transportNumber: sortOrder };
        break;

      default:
        orderBy = { createdAt: sortOrder };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.transporter.findMany({
        where,
        include: transporterInclude,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),

      this.prisma.transporter.count({ where }),
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

  async findById(
    id: string
  ): Promise<TransporterWithRelations | null> {
    return this.prisma.transporter.findUnique({
      where: { id },
      include: transporterInclude,
    });
  }

  async findByTransportNumber(transportNumber: string) {
    return this.prisma.transporter.findUnique({
      where: { transportNumber },
    });
  }



  /* ===========================================
   FIND LATEST TRANSPORTER
=========================================== */

async findLatestTransporter(year: number) {
  return this.prisma.transporter.findFirst({
    where: {
      transportNumber: {
        startsWith: `TPR-${year}-`,
      },
    },

    orderBy: {
      transportNumber: "desc",
    },

    select: {
      transportNumber: true,
    },
  });
}
async create(
  input: CreateTransporterDto & {
    transportNumber: string;
  }
) {
  const data: Prisma.TransporterCreateInput = {
    transportNumber: input.transportNumber,

    transportDate: input.transportDate,

    truckOwnerName: input.truckOwnerName,

    remarks: input.remarks ?? null,

    shipment: input.shipmentId
      ? {
          connect: {
            id: input.shipmentId,
          },
        }
      : undefined,

    items: {
      create: input.items.map((item) => ({
        itemDate: item.itemDate,

        itemType: item.itemType,

        name: item.name ?? null,

        frontPlateNumber: item.frontPlateNumber ?? null,

        backPlateNumber: item.backPlateNumber ?? null,

        containerName: item.containerName ?? null,

        containerNumber: item.containerNumber ?? null,

        status: item.status,

        chargeAmount: new Prisma.Decimal(
          item.chargeAmount
        ),

        chargeCurrency: item.chargeCurrency,

        paymentStatus: item.paymentStatus,

        remarks: item.remarks ?? null,
      })),
    },
  };

  return this.prisma.transporter.create({
    data,
    include: transporterInclude,
  });
}

  async update(
    id: string,
    data: Prisma.TransporterUncheckedUpdateInput
  ) {
    return this.prisma.transporter.update({
      where: { id },
      data,
      include: transporterInclude,
    });
  }

  async delete(id: string) {
    return this.prisma.transporter.delete({
      where: { id },
    });
  }

  async findItemById(
    transporterId: string,
    itemId: string
  ) {
    return this.prisma.transporterItem.findFirst({
      where: {
        id: itemId,
        transporterId,
      },
      include: {
        payments: true,
      },
    });
  }

  async createItem(
    data: Prisma.TransporterItemUncheckedCreateInput
  ) {
    return this.prisma.transporterItem.create({
      data,
      include: {
        payments: true,
      },
    });
  }

  async updateItem(
    itemId: string,
    data: Prisma.TransporterItemUncheckedUpdateInput
  ) {
    return this.prisma.transporterItem.update({
      where: { id: itemId },
      data,
      include: {
        payments: true,
      },
    });
  }

  async deleteItem(itemId: string) {
    return this.prisma.transporterItem.delete({
      where: { id: itemId },
    });
  }

async getItemPayments(
  transporterId: string,
  itemId: string
) {
  return this.prisma.transporterPayment.findMany({
    where: {
      transportItemId: itemId,
      transporterItem: {
        transporterId,
      },
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
    orderBy: {
      paymentDate: "desc",
    },
  });
}

async createPayment(
  data: Prisma.TransporterPaymentUncheckedCreateInput
) {
  return this.prisma.transporterPayment.create({
    data,
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
}