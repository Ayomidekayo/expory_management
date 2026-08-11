import { Prisma } from "../generated";

import { prisma } from "../config/prisma";

import {
  CreateShipmentDto,
  UpdateShipmentDto,
} from "../validations/shipment.validation";

import { ShipmentQuery } from "../validations/shipment-query.validation";

class ShipmentRepository {
  /* ===========================================
     Create
  =========================================== */

  async create(
    data: CreateShipmentDto & {
      shipmentNumber: string;
      createdById: string;
    }
  ) {
    return prisma.shipment.create({
      data: {
        ...data,

        shipmentDate: new Date(
          data.shipmentDate
        ),

        expectedDeparture:
          data.expectedDeparture
            ? new Date(
                data.expectedDeparture
              )
            : undefined,

        expectedArrival:
          data.expectedArrival
            ? new Date(
                data.expectedArrival
              )
            : undefined,

        actualDeparture:
          data.actualDeparture
            ? new Date(
                data.actualDeparture
              )
            : undefined,

        actualArrival:
          data.actualArrival
            ? new Date(
                data.actualArrival
              )
            : undefined,
      },

      include: this.detailsInclude,
    });
  }

  /* ===========================================
     Find Latest Shipment
  =========================================== */

  async findLatestShipment() {
    return prisma.shipment.findFirst({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        shipmentNumber: true,
      },
    });
  }

  /* ===========================================
     Find All
  =========================================== */

  async findAll(
    query: ShipmentQuery
  ) {
    const {
      page,
      limit,
      search,
      status,
      transportMode,
      clientId,
      exporterId,
      consigneeId,
      allocationId,
      sortBy,
      sortOrder,
    } = query;

    const where: Prisma.ShipmentWhereInput = {
      ...(status && {
        status,
      }),

      ...(transportMode && {
        transportMode,
      }),

      ...(clientId && {
        clientId,
      }),

      ...(exporterId && {
        exporterId,
      }),

      ...(consigneeId && {
        consigneeId,
      }),

      ...(allocationId && {
        allocationId,
      }),

      ...(search && {
        OR: [
          {
            shipmentNumber: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            bookingNumber: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            vesselName: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            shippingLine: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            client: {
              companyName: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      }),
    };

    const [data, total] =
      await Promise.all([
        prisma.shipment.findMany({
          where,

          include: this.listInclude,

          orderBy: {
            [sortBy]: sortOrder,
          },

          skip: (page - 1) * limit,

          take: limit,
        }),

        prisma.shipment.count({
          where,
        }),
      ]);

    return {
      data,

      pagination: {
        page,
        limit,
        total,

        totalPages: Math.ceil(
          total / limit
        ),
      },
    };
  }

  /* ===========================================
     Find By Id
  =========================================== */

  async findById(id: string) {
    return prisma.shipment.findUnique({
      where: {
        id,
      },

      include: this.detailsInclude,
    });
  }

  /* ===========================================
     Find By Allocation
  =========================================== */

  async findByAllocationId(
    allocationId: string
  ) {
    return prisma.shipment.findUnique({
      where: {
        allocationId,
      },
    });
  }

  /* ===========================================
     Find Available
     
     Available means:
     Shipment has NO invoices.
  =========================================== */

  async findAvailable() {
    return prisma.shipment.findMany({
      where: {
        invoices: {
          none: {},
        },
      },

      include: this.listInclude,

      orderBy: {
        shipmentDate: "desc",
      },
    });
  }

  /* ===========================================
     Update
  =========================================== */

  async update(
    id: string,
    data: UpdateShipmentDto
  ) {
    return prisma.shipment.update({
      where: {
        id,
      },

      data: {
        ...data,

        shipmentDate:
          data.shipmentDate
            ? new Date(
                data.shipmentDate
              )
            : undefined,

        expectedDeparture:
          data.expectedDeparture !==
          undefined
            ? data.expectedDeparture
              ? new Date(
                  data.expectedDeparture
                )
              : null
            : undefined,

        expectedArrival:
          data.expectedArrival !==
          undefined
            ? data.expectedArrival
              ? new Date(
                  data.expectedArrival
                )
              : null
            : undefined,

        actualDeparture:
          data.actualDeparture !==
          undefined
            ? data.actualDeparture
              ? new Date(
                  data.actualDeparture
                )
              : null
            : undefined,

        actualArrival:
          data.actualArrival !==
          undefined
            ? data.actualArrival
              ? new Date(
                  data.actualArrival
                )
              : null
            : undefined,
      },

      include: this.detailsInclude,
    });
  }

  /* ===========================================
     Delete
  =========================================== */

  async delete(id: string) {
    return prisma.shipment.delete({
      where: {
        id,
      },
    });
  }

  /* ===========================================
     Shared List Include
  =========================================== */

  private listInclude = {
    client: {
      select: {
        id: true,
        companyName: true,
      },
    },

    exporter: {
      select: {
        id: true,
        name: true,
      },
    },

    consignee: {
      select: {
        id: true,
        name: true,
      },
    },

    allocation: {
      select: {
        id: true,
        allocationNumber: true,
      },
    },

    _count: {
      select: {
        containers: true,
        documents: true,
        transits: true,
        invoices: true,
      },
    },
  };

  /* ===========================================
     Shared Details Include
  =========================================== */

  private detailsInclude = {
    client: true,

    exporter: true,

    consignee: true,

    allocation: {
      select: {
        id: true,
        allocationNumber: true,
        serviceType: true,
        priority: true,
        status: true,
      },
    },

    /* =========================================
       ALL INVOICES FOR THIS SHIPMENT
    ========================================= */

    invoices: {
      orderBy: {
        invoiceDate: "desc" as const,
      },
    },

    packingList: true,

    containers: true,

    transits: true,

    documents: true,

    createdBy: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },

    _count: {
      select: {
        containers: true,
        documents: true,
        transits: true,
        invoices: true,
      },
    },
  };
}

export default new ShipmentRepository();