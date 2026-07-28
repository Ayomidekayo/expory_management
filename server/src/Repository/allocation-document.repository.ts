import { prisma } from "../config/prisma";

class AllocationDocumentRepository {
  create(data: any) {
    return prisma.allocationDocument.create({
      data,
    });
  }

  findByAllocation(allocationId: string) {
    return prisma.allocationDocument.findMany({
      where: { allocationId },
      orderBy: { uploadedAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.allocationDocument.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    return prisma.allocationDocument.delete({
      where: { id },
    });
  }
}

export default new AllocationDocumentRepository();
