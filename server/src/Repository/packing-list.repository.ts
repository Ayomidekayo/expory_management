import { Prisma } from "../generated";
import { prisma } from "../config/prisma";

import {
  CreatePackingListDto,
  UpdatePackingListDto,
} from "../validations/packing-list.validation";

import { PackingListQuery } from "../validations/packing-list-query.validation";

class PackingListRepository {
  /*
  =====================================
  Create
  =====================================
  */

  async create(
    data: CreatePackingListDto & {
      packingListNumber: string;
    }
  ) {
    return prisma.packingList.create({
      data: {
        shipmentId: data.shipmentId,

        packingListNumber:
          data.packingListNumber,

        packingDate: new Date(
          data.packingDate
        ),

        packageType:
          data.packageType,

        totalPackages:
          data.totalPackages,

        grossWeight:
          data.grossWeight,

        netWeight:
          data.netWeight,

        marksAndNumbers:
          data.marksAndNumbers,

        remarks:
          data.remarks,

        items: {
          create: data.items,
        },
      },

      include:
        this.detailsInclude,
    });
  }

  /*
  =====================================
  Latest Packing List
  =====================================
  */

  async findLatestPackingList() {
    return prisma.packingList.findFirst({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        packingListNumber: true,
      },
    });
  }

  /*
  =====================================
  Find All
  =====================================
  */

  async findAll(
    query: PackingListQuery
  ) {
    const {
      page,
      limit,
      search,
      shipmentId,
      sortBy,
      sortOrder,
    } = query;

    const where: Prisma.PackingListWhereInput =
      {
        ...(shipmentId && {
          shipmentId,
        }),

        ...(search && {
          OR: [
            {
              packingListNumber: {
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
              shipment: {
                client: {
                  companyName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        }),
      };

    const [data, total] =
      await Promise.all([
        prisma.packingList.findMany({
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

        prisma.packingList.count({
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

  async findById(id: string) {
    return prisma.packingList.findUnique({
      where: {
        id,
      },

      include:
        this.detailsInclude,
    });
  }

  /*
  =====================================
  Find By Shipment
  =====================================
  */

  async findByShipmentId(
    shipmentId: string
  ) {
    return prisma.packingList.findUnique({
      where: {
        shipmentId,
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
    data: UpdatePackingListDto
  ) {
    return prisma.packingList.update({
      where: {
        id,
      },

      data: {
        packingDate:
          data.packingDate
            ? new Date(
                data.packingDate
              )
            : undefined,

        packageType:
          data.packageType,

        totalPackages:
          data.totalPackages,

        grossWeight:
          data.grossWeight,

        netWeight:
          data.netWeight,

        marksAndNumbers:
          data.marksAndNumbers,

        remarks:
          data.remarks,
      },

      include:
        this.detailsInclude,
    });
  }

  /*
  =====================================
  Delete
  =====================================
  */

  async delete(id: string) {
    return prisma.packingList.delete({
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

    _count: {
      select: {
        items: true,

        documents: true,

        containers: true,
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

    items: true,

    documents: true,

    containers: true,

    _count: {
      select: {
        items: true,

        documents: true,

        containers: true,
      },
    },
  };
}

export default new PackingListRepository();