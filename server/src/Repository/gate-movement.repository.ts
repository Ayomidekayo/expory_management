import {
  GateMovementStatus,
  GateType,
  Prisma,
} from "../generated";

import { prisma } from "../config/prisma";

class GateMovementRepository {
  /*
  =========================================
  CREATE
  =========================================
  */

  async create(
    data: Prisma.GateMovementCreateInput
  ) {
    return prisma.gateMovement.create({
      data,

      include: {
        container: {
          include: {
            shipment: {
              include: {
                client: true,
                exporter: true,
                consignee: true,
                allocation: true,
              },
            },
          },
        },
      },
    });
  }

  /*
  =========================================
  FIND BY ID
  =========================================
  */

  async findById(id: string) {
    return prisma.gateMovement.findUnique({
      where: {
        id,
      },

      include: {
        container: {
          include: {
            shipment: {
              include: {
                client: true,
                exporter: true,
                consignee: true,
                allocation: true,
              },
            },
          },
        },
      },
    });
  }

  /*
  =========================================
  FIND ALL
  =========================================
  */

  async findAll(params?: {
    gateType?: GateType;

    status?: GateMovementStatus;

    containerNumber?: string;

    yardStoreNumber?: string;
  }) {
    return prisma.gateMovement.findMany({
      where: {
        ...(params?.gateType && {
          gateType: params.gateType,
        }),

        ...(params?.status && {
          status: params.status,
        }),

        ...(params?.containerNumber && {
          containerNumber: {
            contains:
              params.containerNumber,

            mode: "insensitive",
          },
        }),

        ...(params?.yardStoreNumber && {
          yardStoreNumber: {
            contains:
              params.yardStoreNumber,

            mode: "insensitive",
          },
        }),
      },

      include: {
        container: {
          include: {
            shipment: {
              include: {
                client: true,
                exporter: true,
                consignee: true,
                allocation: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /*
  =========================================
  UPDATE
  =========================================
  */

  async update(
    id: string,
    data: Prisma.GateMovementUpdateInput
  ) {
    return prisma.gateMovement.update({
      where: {
        id,
      },

      data,

      include: {
        container: {
          include: {
            shipment: {
              include: {
                client: true,
                exporter: true,
                consignee: true,
                allocation: true,
              },
            },
          },
        },
      },
    });
  }

  /*
  =========================================
  DELETE
  =========================================
  */

  async delete(id: string) {
    return prisma.gateMovement.delete({
      where: {
        id,
      },
    });
  }

  /*
  =========================================
  COUNT
  =========================================
  */

  async count(params?: {
    gateType?: GateType;

    status?: GateMovementStatus;
  }) {
    return prisma.gateMovement.count({
      where: {
        ...(params?.gateType && {
          gateType: params.gateType,
        }),

        ...(params?.status && {
          status: params.status,
        }),
      },
    });
  }
}

export default new GateMovementRepository();