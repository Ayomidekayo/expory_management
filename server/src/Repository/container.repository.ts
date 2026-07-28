import { ContainerType, Prisma } from "../generated";
import { prisma } from "../config/prisma";

import {
  CreateContainerDto,
  UpdateContainerDto,
} from "../validations/container.validation";

import { ContainerQuery } from "../validations/container-query.validation";

class ContainerRepository {async create(
  data: CreateContainerDto

) {
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

    shippingLine: data.shippingLine,

    bookingReference: data.bookingReference,

    containerCondition: data.containerCondition,
  },

  include: this.detailsInclude,
});;
}

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

async findAll(
  query: ContainerQuery
) {
  const {
    page,
    limit,
    search,
    shipmentId,
    packingListId,
    status,
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

  const [data, total] =
    await Promise.all([

      prisma.container.findMany({

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

      totalPages:
        Math.ceil(
          total / limit
        ),

    },

  };
}

async findById(
  id: string
) {
  return prisma.container.findUnique({
    where: {
      id,
    },

    include:
      this.detailsInclude,
  });
}
async findByContainerNumber(
  containerNumber: string
) {
  return prisma.container.findUnique({
    where: {
      containerNumber,
    },
  });
}

async update(
  id: string,
  data: UpdateContainerDto
) {
  return prisma.container.update({
    where: {
      id,
    },

    data,

    include:
      this.detailsInclude,
  });
}
async delete(
  id: string
) {
  return prisma.container.delete({
    where: {
      id,
    },
  });
}

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