import { Prisma } from "../generated";
import { prisma } from "../config/prisma";

import {
  CreateTransitDto,
  UpdateTransitDto,
} from "../validations/transit.validation";

import {
  TransitQuery,
} from "../validations/transit-query.validation";

class TransitRepository {

  /*
  =====================================
  Create
  =====================================
  */

  async create(
    data: CreateTransitDto & {
      transitNumber: string;
    }
  ) {
    return prisma.transit.create({

      data: {

        transitNumber:
          data.transitNumber,

        shipmentId:
          data.shipmentId,

        containerId:
          data.containerId,

        origin:
          data.origin,

        destination:
          data.destination,

        transportMode:
          data.transportMode,

        transporter:
          data.transporter,

        transitInvoice:
          data.transitInvoice,

        agentNumber:
          data.agentNumber,

        exporterNumber:
          data.exporterNumber,

        wibNumber:
          data.wibNumber,

        quantity:
          data.quantity,

        description:
          data.description,

        unitPrice:
          data.unitPrice,

        totalPrice:
          data.totalPrice,

      },

      include:
        this.detailsInclude,

    });
  }

  /*
  =====================================
  Latest Transit
  =====================================
  */

  async findLatestTransit() {

    return prisma.transit.findFirst({

      orderBy: {
        createdAt: "desc",
      },

      select: {
        transitNumber: true,
      },

    });

  }

  /*
  =====================================
  Find All
  =====================================
  */

  async findAll(
    query: TransitQuery
  ) {

    const {

      page,

      limit,

      search,

      shipmentId,

      containerId,

      transportMode,

      sortBy,

      sortOrder,

    } = query;

    const where: Prisma.TransitWhereInput = {

      ...(shipmentId && {
        shipmentId,
      }),

      ...(containerId && {
        containerId,
      }),

      ...(transportMode && {
        transportMode,
      }),

      ...(search && {

        OR: [

          {
            transitNumber: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            origin: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            destination: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            transporter: {
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
            container: {
              containerNumber: {
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

        prisma.transit.findMany({

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

        prisma.transit.count({
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

  /*
  =====================================
  Find By Id
  =====================================
  */

  async findById(
    id: string
  ) {

    return prisma.transit.findUnique({

      where: {
        id,
      },

      include:
        this.detailsInclude,

    });

  }

  /*
  =====================================
  Find By Transit Number
  =====================================
  */

  async findByTransitNumber(
    transitNumber: string
  ) {

    return prisma.transit.findUnique({

      where: {
        transitNumber,
      },

    });

  }

  /*
  =====================================
  Update
  =====================================
  */

  async update(
    id: string,
    data: UpdateTransitDto
  ) {

    return prisma.transit.update({

      where: {
        id,
      },

      data,

      include:
        this.detailsInclude,

    });

  }

  /*
  =====================================
  Delete
  =====================================
  */

  async delete(
    id: string
  ) {

    return prisma.transit.delete({

      where: {
        id,
      },

    });

  }

  /*
  =====================================
  LIST INCLUDE
  =====================================
  */

  private listInclude = {

    shipment: {

      select: {

        id: true,

        shipmentNumber: true,

        client: {

          select: {
            companyName: true,
          },

        },

      },

    },

    container: {

      select: {

        id: true,

        containerNumber: true,

        containerType: true,

        containerSize: true,

      },

    },

    _count: {

      select: {

        documents: true,

      },

    },

  };

  /*
  =====================================
  DETAILS INCLUDE
  =====================================
  */

  private detailsInclude = {

    shipment: {

      include: {

        client: true,

        exporter: true,

        consignee: true,

        allocation: true,

      },

    },

    container: {

      include: {

        packingList: true,

      },

    },

    documents: true,

    _count: {

      select: {

        documents: true,

      },

    },

  };

}

export default new TransitRepository();