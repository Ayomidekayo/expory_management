import {
  GateMovementStatus,
  GateType,
  Prisma,
  ShipmentStatus,
} from "../generated";

import { prisma } from "../config/prisma";

class GateMovementRepository {
  /* =========================================
     CREATE
  ========================================= */

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

  /* =========================================
     FIND BY ID
  ========================================= */

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

  /* =========================================
     FIND ALL
  ========================================= */

// async findAll(params?: {
//   gateType?: GateType;
//   status?: GateMovementStatus;
//   containerNumber?: string;
//   yardStoreNumber?: string;
//   shipmentId?: string;
//   shipmentNumber?: string;
// }) {
//   /*
//   =========================================
//   SEARCH CHECK
//   =========================================
//   */

//   const searchExists =
//     !!params?.containerNumber ||
//     !!params?.yardStoreNumber ||
//     !!params?.shipmentNumber;

//   /*
//   =========================================
//   SHIPMENT FILTER
//   =========================================

//   Build the shipment filter separately so
//   TypeScript does not narrow the Prisma
//   relation type incorrectly.
//   =========================================
//   */

//   let shipmentWhere:
//     | Prisma.ShipmentWhereInput
//     | undefined;

//   /*
//   =========================================
//   DEFAULT ACTIVE SHIPMENTS ONLY
//   =========================================
//   */

//   if (
//     !searchExists &&
//     !params?.shipmentId
//   ) {
//     shipmentWhere = {
//       status: {
//         notIn: [
//           ShipmentStatus.COMPLETED,
//           ShipmentStatus.CANCELLED,
//         ],
//       },
//     };
//   }

//   /*
//   =========================================
//   SHIPMENT NUMBER SEARCH
//   =========================================
//   */

//   if (params?.shipmentNumber) {
//     shipmentWhere = {
//       shipmentNumber: {
//         contains:
//           params.shipmentNumber,
//         mode: "insensitive",
//       },
//     };
//   }

//   /*
//   =========================================
//   CONTAINER FILTER
//   =========================================

//   Build the container filter once.
//   =========================================
//   */

//   const containerWhere:
//     Prisma.ContainerWhereInput = {
//     ...(params?.shipmentId && {
//       shipmentId:
//         params.shipmentId,
//     }),

//     ...(shipmentWhere && {
//       shipment: shipmentWhere,
//     }),
//   };

//   /*
//   =========================================
//   FINAL WHERE
//   =========================================
//   */

//   const where:
//     Prisma.GateMovementWhereInput = {
//     /*
//     Container relationship filters
//     */

//     ...(Object.keys(
//       containerWhere
//     ).length > 0 && {
//       container: containerWhere,
//     }),

//     /*
//     =========================================
//     GATE TYPE
//     =========================================
//     */

//     ...(params?.gateType && {
//       gateType:
//         params.gateType,
//     }),

//     /*
//     =========================================
//     GATE STATUS
//     =========================================
//     */

//     ...(params?.status && {
//       status:
//         params.status,
//     }),

//     /*
//     =========================================
//     CONTAINER NUMBER
//     =========================================
//     */

//     ...(params?.containerNumber && {
//       containerNumber: {
//         contains:
//           params.containerNumber,
//         mode: "insensitive",
//       },
//     }),

//     /*
//     =========================================
//     YARD / STORE NUMBER
//     =========================================
//     */

//     ...(params?.yardStoreNumber && {
//       yardStoreNumber: {
//         contains:
//           params.yardStoreNumber,
//         mode: "insensitive",
//       },
//     }),
//   };

//   /*
//   =========================================
//   FETCH GATE MOVEMENTS
//   =========================================
//   */

//   return prisma.gateMovement.findMany({
//     where,

//     include: {
//       container: {
//         include: {
//           shipment: {
//             select: {
//               id: true,

//               shipmentNumber: true,

//               shipmentDate: true,

//               status: true,

//               transportMode: true,

//               bookingNumber: true,

//               shippingLine: true,

//               vesselName: true,

//               voyageNumber: true,

//               client: {
//                 select: {
//                   id: true,
//                   companyName: true,
//                 },
//               },

//               exporter: {
//                 select: {
//                   id: true,
//                   name: true,
//                 },
//               },

//               consignee: {
//                 select: {
//                   id: true,
//                   name: true,
//                 },
//               },

//               allocation: true,
//             },
//           },
//         },
//       },
//     },

//     orderBy: {
//       createdAt: "desc",
//     },
//   });
// }/* =========================================
  

/* =========================================
   FIND ALL
========================================= */

async findAll(params?: {
  gateType?: GateType;
  status?: GateMovementStatus;
  containerNumber?: string;
  yardStoreNumber?: string;
  shipmentId?: string;
  shipmentNumber?: string;
  search?: string;
}) {
  const search = params?.search?.trim();

  /*
  =========================================
  CONTAINER FILTER
  =========================================
  */

  const containerWhere: Prisma.ContainerWhereInput = {
    ...(params?.shipmentId && {
      shipmentId: params.shipmentId,
    }),

    /*
    Search container number OR shipment number.

    NOTE:
    yardStoreNumber is NOT here because
    it belongs to GateMovement.
    */

    ...(search && {
      OR: [
        {
          containerNumber: {
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

    /*
    Explicit shipment number filter
    */

    ...(params?.shipmentNumber && {
      shipment: {
        shipmentNumber: {
          contains: params.shipmentNumber,
          mode: "insensitive",
        },
      },
    }),
  };

  /*
  =========================================
  FINAL WHERE
  =========================================
  */

  const where: Prisma.GateMovementWhereInput = {
    /*
    Container relationship filters
    */

    ...(Object.keys(containerWhere).length > 0 && {
      container: containerWhere,
    }),

    /*
    Gate type
    */

    ...(params?.gateType && {
      gateType: params.gateType,
    }),

    /*
    Gate status
    */

    ...(params?.status && {
      status: params.status,
    }),

    /*
    Container number
    */

    ...(params?.containerNumber && {
      containerNumber: {
        contains: params.containerNumber,
        mode: "insensitive",
      },
    }),

    /*
    Yard / Store number

    IMPORTANT:
    This belongs directly to GateMovement.
    */

    ...(params?.yardStoreNumber && {
      yardStoreNumber: {
        contains: params.yardStoreNumber,
        mode: "insensitive",
      },
    }),
  };

  /*
  =========================================
  FETCH GATE MOVEMENTS
  =========================================

  Gate movements remain visible even when
  their shipment is COMPLETED or CANCELLED.
  =========================================
  */

  return prisma.gateMovement.findMany({
    where,

    include: {
      container: {
        include: {
          shipment: {
            select: {
              id: true,
              shipmentNumber: true,
              shipmentDate: true,
              status: true,
              transportMode: true,
              bookingNumber: true,
              shippingLine: true,
              vesselName: true,
              voyageNumber: true,

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

  /* =========================================
     UPDATE
  ========================================= */

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

  /* =========================================
     DELETE
  ========================================= */

  async delete(id: string) {
    return prisma.gateMovement.delete({
      where: {
        id,
      },
    });
  }

  /* =========================================
     COUNT
  ========================================= */

  async count(params?: {
    gateType?: GateType;
    status?: GateMovementStatus;
  }) {
    return prisma.gateMovement.count({
      where: {
        ...(params?.gateType && {
          gateType:
            params.gateType,
        }),

        ...(params?.status && {
          status:
            params.status,
        }),
      },
    });
  }
}

export default new GateMovementRepository();