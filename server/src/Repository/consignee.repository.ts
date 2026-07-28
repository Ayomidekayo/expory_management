import { prisma } from "../config/prisma";
import { CreateConsigneeDto, UpdateConsigneeDto } from "../validations/consignee.validation";


class ConsigneeRepository {
  /*
  =====================================
  Shared Include
  =====================================
  */

  private include = {
    allocations: {
      include: {
        client: true,
      },

      orderBy: {
        createdAt: "desc" as const,
      },
    },

    shipments: {
      orderBy: {
        shipmentDate: "desc" as const,
      },
    },

    _count: {
      select: {
        allocations: true,
        shipments: true,
      },
    },
  };

  /*
  =====================================
  Create
  =====================================
  */

  async create(data: CreateConsigneeDto) {
    return prisma.consignee.create({
      data,

      include: this.include,
    });
  }

  /*
  =====================================
  Find All
  =====================================
  */

  async findAll() {
    return prisma.consignee.findMany({
      include: this.include,

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /*
  =====================================
  Find By Id
  =====================================
  */

  async findById(id: string) {
    return prisma.consignee.findUnique({
      where: {
        id,
      },

      include: this.include,
    });
  }

  /*
  =====================================
  Find By Email
  =====================================
  */

  async findByEmail(email: string) {
    return prisma.consignee.findFirst({
      where: {
        email,
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
    data: UpdateConsigneeDto
  ) {
    return prisma.consignee.update({
      where: {
        id,
      },

      data,

      include: this.include,
    });
  }

  /*
  =====================================
  Delete
  =====================================
  */

  async delete(id: string) {
    return prisma.consignee.delete({
      where: {
        id,
      },

      include: this.include,
    });
  }
}

export default new ConsigneeRepository();