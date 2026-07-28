import { prisma } from "../config/prisma";
import { Prisma } from "../generated/client";
import { ClientQueryDto } from "../validations/client-query.validation";

class ClientRepository {
  /*
  =====================================
  Create
  =====================================
  */

  async create(data: Prisma.ClientCreateInput) {
    return prisma.client.create({
      data,

      include: {
        _count: {
          select: {
            allocations: true,
            shipments: true,
          },
        },
      },
    });
  }

  /*
  =====================================
  Find All
  =====================================
  */

  async findAll(query: ClientQueryDto) {
    const {
      page,
      limit,
      search,
      clientType,
      country,
      isActive,
    } = query;

    const where: Prisma.ClientWhereInput = {
      ...(clientType && {
        clientType,
      }),

      ...(country && {
        country: {
          equals: country,
          mode: "insensitive",
        },
      }),

      ...(isActive !== undefined && {
        isActive,
      }),

      ...(search && {
        OR: [
          {
            companyName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            clientCode: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            contactPerson: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    const [clients, total] =
      await prisma.$transaction([
        prisma.client.findMany({
          where,

          skip: (page - 1) * limit,

          take: limit,

          orderBy: {
            createdAt: "desc",
          },

          include: {
            _count: {
              select: {
                allocations: true,
                shipments: true,
              },
            },
          },
        }),

        prisma.client.count({
          where,
        }),
      ]);

    return {
      data: clients,

      pagination: {
        total,

        page,

        limit,

        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /*
  =====================================
  Find By Id
  =====================================
  */

async findById(id: string) {
  return prisma.client.findUnique({
    where: {
      id,
    },

    include: {
      allocations: {
        include: {
          shipment: true,
        },
      },

      shipments: true,

      _count: {
        select: {
          allocations: true,
          shipments: true,
        },
      },
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
    data: Prisma.ClientUpdateInput
  ) {
    return prisma.client.update({
      where: {
        id,
      },

      data,

      include: {
        _count: {
          select: {
            allocations: true,
            shipments: true,
          },
        },
      },
    });
  }

  /*
  =====================================
  Delete
  =====================================
  */

  async delete(id: string) {
    return prisma.client.delete({
      where: {
        id,
      },
    });
  }

  /*
  =====================================
  Activate / Deactivate
  =====================================
  */

  async updateStatus(
    id: string,
    isActive: boolean
  ) {
    return prisma.client.update({
      where: {
        id,
      },

      data: {
        isActive,
      },
    });
  }
}

export default new ClientRepository();