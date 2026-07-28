import { Prisma } from "../generated/client";
import { prisma } from "../config/prisma";

export class ExporterRepository {
  async findAll() {
    return prisma.exporter.findMany({
      include: {
        _count: {
          select: {
            allocations: true,
            shipments: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.exporter.findUnique({
      where: {
        id,
      },

      include: {
        allocations: {
          orderBy: {
            createdAt: "desc",
          },
        },

        shipments: {
          orderBy: {
            shipmentDate: "desc",
          },
        },

        _count: {
          select: {
            allocations: true,
            shipments: true,
          },
        },
      },
    });
  }

  async create(
    data: Prisma.ExporterCreateInput
  ) {
    return prisma.exporter.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.ExporterUpdateInput
  ) {
    return prisma.exporter.update({
      where: {
        id,
      },

      data,
    });
  }

  async delete(id: string) {
    return prisma.exporter.delete({
      where: {
        id,
      },
    });
  }
}

export default new ExporterRepository();