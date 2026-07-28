import { AllocationStatus, Prisma } from "../generated";
import { prisma } from "../config/prisma";

import {
  CreateAllocationDto,
  UpdateAllocationDto,
} from "../validations/allocation.validation";

import { AllocationQuery } from "../validations/allocation-query.validation";

class AllocationRepository {
  /*
  =====================================
  Update Status
  =====================================
  */

  async updateStatus(
    id: string,
    status: AllocationStatus
  ) {
    return prisma.allocation.update({
      where: { id },

      data: {
        status,
      },

      include: this.include,
    });
  }

  /*
  =====================================
  Latest Allocation
  =====================================
  */

  async findLatestAllocation() {
    return prisma.allocation.findFirst({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        allocationNumber: true,
      },
    });
  }

  /*
  =====================================
  Create
  =====================================
  */

  async create(
    data: CreateAllocationDto & {
      allocationNumber: string;
      createdById: string;
    }
  ) {
    return prisma.allocation.create({
      data: {
        ...data,

        pickupDate: data.pickupDate
          ? new Date(data.pickupDate)
          : undefined,

        expectedShipmentDate:
          data.expectedShipmentDate
            ? new Date(data.expectedShipmentDate)
            : undefined,
      },

      include: this.include,
    });
  }

  /*
  =====================================
  Find All
  =====================================
  */

  async findAll(query: AllocationQuery) {
    const {
      page,
      limit,
      search,
      status,
      priority,
      serviceType,
      transportMode,
      clientId,
      exporterId,
      consigneeId,
      assignedToId,
      createdById,
      approvedById,
      isActive,
      sortBy,
      sortOrder,
    } = query;

    const where: Prisma.AllocationWhereInput = {
      ...(status && { status }),
      ...(priority && { priority }),
      ...(serviceType && { serviceType }),
      ...(transportMode && { transportMode }),
      ...(clientId && { clientId }),
      ...(exporterId && { exporterId }),
      ...(consigneeId && { consigneeId }),
      ...(assignedToId && { assignedToId }),
      ...(createdById && { createdById }),
      ...(approvedById && { approvedById }),
      ...(isActive !== undefined && {
        isActive,
      }),

      ...(search && {
        OR: [
          {
            allocationNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            cargoDescription: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            commodityName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            client: {
              companyName: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      }),
    };

    const [data, total] =
      await prisma.$transaction([
        prisma.allocation.findMany({
          where,

          include: this.include,

          orderBy: {
            [sortBy]: sortOrder,
          },

          skip: (page - 1) * limit,

          take: limit,
        }),

        prisma.allocation.count({
          where,
        }),
      ]);

    return {
      data,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
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
    return prisma.allocation.findUnique({
      where: {
        id,
      },

      include: this.include,
    });
  }

  /*
  =====================================
  Update
  =====================================
  */

  async update(
    id: string,
    data: UpdateAllocationDto
  ) {
    return prisma.allocation.update({
      where: {
        id,
      },

      data: {
        ...data,

        pickupDate:
          data.pickupDate !== undefined
            ? data.pickupDate
              ? new Date(data.pickupDate)
              : null
            : undefined,

        expectedShipmentDate:
          data.expectedShipmentDate !== undefined
            ? data.expectedShipmentDate
              ? new Date(data.expectedShipmentDate)
              : null
            : undefined,
      },

      include: this.include,
    });
  }

  /*
  =====================================
  Delete
  =====================================
  */

  async delete(id: string) {
    return prisma.allocation.delete({
      where: {
        id,
      },
    });
  }

  /*
  =====================================
  Shared Include
  =====================================
  */

  private include = {
    client: true,

    exporter: true,

    consignee: true,

    shipment: true,

    documents: true,

    createdBy: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },

    assignedTo: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },

    approvedBy: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },

    _count: {
      select: {
        documents: true,
      },
    },
  };
}

export default new AllocationRepository();