import {
  Prisma,
  ShipmentStatus,
} from "../generated";

import { prisma } from "../config/prisma";

import {
  CreateShipmentDto,
  UpdateShipmentDto,
} from "../validations/shipment.validation";

import { ShipmentQuery } from "../validations/shipment-query.validation";

class ShipmentRepository {
  /* ===========================================
     CREATE
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
     FIND LATEST SHIPMENT
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
     FIND ALL
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

    /*
    ===========================================
    SHIPMENT VISIBILITY
    ===========================================
    */

    const statusFilter:
      Prisma.ShipmentWhereInput =
      status
        ? {
            status,
          }
        : !search
        ? {
            status: {
              notIn: [
                ShipmentStatus.COMPLETED,
                ShipmentStatus.CANCELLED,
              ],
            },
          }
        : {};

    /*
    ===========================================
    SEARCH
    ===========================================
    */

    const searchFilter:
      Prisma.ShipmentWhereInput =
      search
        ? {
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
          }
        : {};

    /*
    ===========================================
    FINAL WHERE
    ===========================================
    */

    const where:
      Prisma.ShipmentWhereInput = {
      ...statusFilter,

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

      ...searchFilter,
    };

    /*
    ===========================================
    FETCH DATA + COUNT
    ===========================================
    */

    const [data, total] =
      await Promise.all([
        prisma.shipment.findMany({
          where,

          include:
            this.listInclude,

          orderBy: {
            [sortBy]:
              sortOrder,
          },

          skip:
            (page - 1) * limit,

          take:
            limit,
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

        totalPages:
          Math.ceil(
            total / limit
          ),
      },
    };
  }

  /* ===========================================
     FIND BY ID

     Returns the COMPLETE shipment ecosystem.
  =========================================== */

  async findById(id: string) {
    return prisma.shipment.findUnique({
      where: {
        id,
      },

      include:
        this.detailsInclude,
    });
  }

  /* ===========================================
     FIND BY ALLOCATION
  =========================================== */

  async findByAllocationId(
    allocationId: string
  ) {
    return prisma.shipment.findUnique({
      where: {
        allocationId,
      },

      include:
        this.detailsInclude,
    });
  }

  /* ===========================================
     FIND AVAILABLE

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

      include:
        this.listInclude,

      orderBy: {
        shipmentDate: "desc",
      },
    });
  }

  /* ===========================================
     GET STATUS COUNTS
  =========================================== */

  async getStatusCounts() {
    const [
      active,
      completed,
      cancelled,
    ] = await Promise.all([
      prisma.shipment.count({
        where: {
          status: {
            notIn: [
              ShipmentStatus.COMPLETED,
              ShipmentStatus.CANCELLED,
            ],
          },
        },
      }),

      prisma.shipment.count({
        where: {
          status:
            ShipmentStatus.COMPLETED,
        },
      }),

      prisma.shipment.count({
        where: {
          status:
            ShipmentStatus.CANCELLED,
        },
      }),
    ]);

    return {
      active,
      completed,
      cancelled,
    };
  }

  /* ===========================================
     UPDATE
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

      include:
        this.detailsInclude,
    });
  }

  /* ===========================================
     DELETE
  =========================================== */

  async delete(id: string) {
    return prisma.shipment.delete({
      where: {
        id,
      },
    });
  }

  /* ===========================================
     LIST INCLUDE

     Lightweight response for shipment table.
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
     COMPLETE DETAILS INCLUDE

     Used when viewing one shipment.

     Everything related to the shipment is
     loaded here.
  =========================================== */

  private detailsInclude = {
    /*
    ===========================================
    CLIENT
    ===========================================
    */

    client: true,

    /*
    ===========================================
    EXPORTER
    ===========================================
    */

    exporter: true,

    /*
    ===========================================
    CONSIGNEE
    ===========================================
    */

    consignee: true,

    /*
    ===========================================
    ALLOCATION
    ===========================================
    */

    allocation: {
      include: {
        client: true,

        exporter: true,

        consignee: true,

        attachedDocuments: true,

        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        _count: {
          select: {
            attachedDocuments: true,
          },
        },
      },
    },

    /*
    ===========================================
    INVOICES
    ===========================================

    Every invoice belonging to this shipment.
    ===========================================
    */

    invoices: {
      orderBy: {
        invoiceDate:
          Prisma.SortOrder.desc,
      },

      include: {
        items: true,

        documents: true,

        _count: {
          select: {
            items: true,
            documents: true,
          },
        },
      },
    },

    /*
    ===========================================
    PACKING LIST
    ===========================================

    Full packing list.
    ===========================================
    */

    packingList: {
      include: {
        items: {
          orderBy: {
            createdAt:
              Prisma.SortOrder.asc,
          },
        },

        documents: true,

        containers: true,

        _count: {
          select: {
            items: true,
            documents: true,
            containers: true,
          },
        },
      },
    },

    /*
    ===========================================
    CONTAINERS
    ===========================================

    Every container belonging to shipment.

    Each container includes its gate
    movements.
    ===========================================
    */

    containers: {
      orderBy: {
        createdAt:
          Prisma.SortOrder.desc,
      },

      include: {
        /*
        =====================================
        GATE MOVEMENTS
        =====================================
        */

        gateMovements: {
          orderBy: {
            createdAt:
              Prisma.SortOrder.desc,
          },
        },

        /*
        =====================================
        CONTAINER DOCUMENTS
        =====================================
        */

        documents: true,

        /*
        =====================================
        CONTAINER TRANSITS
        =====================================
        */

        transits: {
          orderBy: {
            createdAt:
              Prisma.SortOrder.desc,
          },
        },

        _count: {
          select: {
            documents: true,
            transits: true,
            gateMovements: true,
          },
        },
      },
    },

    /*
    ===========================================
    SHIPMENT TRANSITS
    ===========================================
    */

    transits: {
      orderBy: {
        createdAt:
          Prisma.SortOrder.desc,
      },
    },

    /*
    ===========================================
    SHIPMENT DOCUMENTS
    ===========================================

    IMPORTANT:
    Do not use orderBy here because your
    generated Prisma Shipment.documents
    relation does not accept the supplied
    orderBy shape.
    ===========================================
    */

    documents: true,

    /*
    ===========================================
    CREATED BY
    ===========================================
    */

    createdBy: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },

    /*
    ===========================================
    SHIPMENT COUNTS
    ===========================================
    */

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