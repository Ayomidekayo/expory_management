import { prisma } from "../config/prisma";

import { Prisma } from "../generated";

class AllocationDocumentRepository {
  /*
  =====================================
  Create
  =====================================
  */

  async create(
    data: Prisma.AllocationDocumentCreateInput
  ) {
    return prisma.allocationDocument.create({
      data,
    });
  }

  /*
  =====================================
  Find By Allocation
  =====================================
  */

  async findByAllocation(
    allocationId: string
  ) {
    return prisma.allocationDocument.findMany({
      where: {
        allocationId,
      },

      orderBy: {
        uploadedAt: "desc",
      },
    });
  }

  /*
  =====================================
  Find By Id
  =====================================
  */

  async findById(
    id: string
  ) {
    return prisma.allocationDocument.findUnique({
      where: {
        id,
      },
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
    return prisma.allocationDocument.delete({
      where: {
        id,
      },
    });
  }
}

export default new AllocationDocumentRepository();