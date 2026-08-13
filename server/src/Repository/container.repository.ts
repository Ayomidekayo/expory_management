import {
  ContainerStatus,
  Prisma,
  TerminalChargeStatus,
} from "../generated";

import { prisma } from "../config/prisma";

import {
  CreateContainerDto,
  UpdateContainerDto,
} from "../validations/container.validation";

import { ContainerQuery } from "../validations/container-query.validation";

class ContainerRepository {
  /*
  =====================================
  Create
  =====================================
  */

  async create(data: CreateContainerDto) {
    return prisma.container.create({
      data: {
        shipmentId: data.shipmentId,

        packingListId: data.packingListId,

        containerNumber: data.containerNumber,

        sealNumber: data.sealNumber,

        containerType: data.containerType,

        containerSize: data.containerSize,

        grossWeight: data.grossWeight,

        netWeight: data.netWeight,

        tareWeight: data.tareWeight,

        volume: data.volume,

        loadingLocation: data.loadingLocation,

        destination: data.destination,

        status: data.status,

        terminalChargeStatus:
          data.terminalChargeStatus ?? "UNPAID",

        shippingLine: data.shippingLine,

        bookingReference: data.bookingReference,

        containerCondition:
          data.containerCondition,
      },

      include: this.detailsInclude,
    });
  }

  /*
  =====================================
  Latest Container
  =====================================
  */

  async findLatestContainer() {
    return prisma.container.findFirst({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        containerNumber: true,
      },
    });
  }

  /*
  =====================================
  Find All
  =====================================
  */

  async findAll(query: ContainerQuery) {
    const {
      page,
      limit,
      search,
      shipmentId,
      packingListId,
      status,
      terminalChargeStatus,
      containerType,
      containerSize,
      sortBy,
      sortOrder,
    } = query;

    const where: Prisma.ContainerWhereInput = {
      ...(shipmentId && {
        shipmentId,
      }),

      ...(packingListId && {
        packingListId,
      }),

      ...(status && {
        status,
      }),

      ...(terminalChargeStatus && {
        terminalChargeStatus,
      }),

      ...(containerType && {
        containerType,
      }),

      ...(containerSize && {
        containerSize,
      }),

      ...(search && {
        OR: [
          {
            containerNumber: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            sealNumber: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            bookingReference: {
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
        ],
      }),
    };

    const [data, total] = await Promise.all([
      prisma.container.findMany({
        where,

        include: this.listInclude,

        orderBy: {
          [sortBy]: sortOrder,
        },

        skip: (page - 1) * limit,

        take: limit,
      }),

      prisma.container.count({
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

  /*
  =====================================
  Find One
  =====================================
  */

  async findById(id: string) {
    return prisma.container.findUnique({
      where: {
        id,
      },

      include: this.detailsInclude,
    });
  }

  /*
  =====================================
  Find By Container Number
  =====================================
  */

  async findByContainerNumber(
    containerNumber: string
  ) {
    return prisma.container.findUnique({
      where: {
        containerNumber,
      },
    });
  }

  /*
  =====================================
  Update Physical Status
  =====================================
  */

  async updateStatus(
    id: string,
    status: ContainerStatus
  ) {
    return prisma.container.update({
      where: {
        id,
      },

      data: {
        status,
      },

      include: this.detailsInclude,
    });
  }

  /*
  =====================================
  Update Terminal Charge Status
  =====================================
  */

  async updateTerminalChargeStatus(
    id: string,
    terminalChargeStatus: TerminalChargeStatus
  ) {
    return prisma.container.update({
      where: {
        id,
      },

      data: {
        terminalChargeStatus,
      },

      include: this.detailsInclude,
    });
  }

  /*
  =====================================
  Update
  =====================================
  */

  async update(
    id: string,
    data: UpdateContainerDto
  ) {
    return prisma.container.update({
      where: {
        id,
      },

      data,

      include: this.detailsInclude,
    });
  }

  /*
  =====================================
  Update Terminal Charge
  =====================================
  */

  async updateTerminalCharge(
    id: string,
    status: TerminalChargeStatus,
    amount?: number
  ) {
    return prisma.container.update({
      where: {
        id,
      },

      data: {
        terminalChargeStatus: status,

        terminalChargeAmount:
          amount !== undefined
            ? amount
            : null,
      },

      include: this.detailsInclude,
    });
  }

  /*
  =====================================
  Delete
  =====================================
  */

  async delete(id: string) {
    /*
    Check whether the container exists
    and whether it has any transit records.
    */

    const container =
      await prisma.container.findUnique({
        where: {
          id,
        },

        select: {
          id: true,

          containerNumber: true,

          _count: {
            select: {
              transits: true,
            },
          },
        },
      });

    /*
    Container does not exist
    */

    if (!container) {
      throw new Error(
        "Container not found"
      );
    }

    /*
    Prevent deletion when the container
    is still being used by Transit.
    */

    if (container._count.transits > 0) {
      throw new Error(
        `Cannot delete container ${container.containerNumber}. ` +
          `It has ${container._count.transits} ` +
          `${
            container._count.transits === 1
              ? "transit record"
              : "transit records"
          } associated with it. ` +
          `Remove the associated transit records first.`
      );
    }

    /*
    Safe to delete.
    */

    return prisma.container.delete({
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

    packingList: {
      select: {
        id: true,

        packingListNumber: true,
      },
    },

    _count: {
      select: {
        documents: true,

        transits: true,
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

    packingList: true,

    documents: true,

    transits: true,

    _count: {
      select: {
        documents: true,

        transits: true,
      },
    },
  };
}

export default new ContainerRepository();