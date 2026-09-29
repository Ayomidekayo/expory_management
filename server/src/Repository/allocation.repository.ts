import {
  AllocationStatus,
  Prisma,
  ShipmentStatus,
} from "../generated";

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
      where: {
        id,
      },

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
      page = 1,
      limit = 10,
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
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const trimmedSearch =
      search?.trim();

    /*
    =====================================
    SHIPMENT VISIBILITY

    Normal allocation list:
    - Show allocations without a shipment
    - Show allocations linked to active
      shipments
    - Hide allocations linked to
      COMPLETED/CANCELLED shipments

    Search:
    - Allow archived allocations to
      be found
    =====================================
    */

    const shipmentVisibilityFilter:
      Prisma.AllocationWhereInput =
      !trimmedSearch
        ? {
            OR: [
              {
                shipment: null,
              },

              {
                shipment: {
                  status: {
                    notIn: [
                      ShipmentStatus.COMPLETED,
                      ShipmentStatus.CANCELLED,
                    ],
                  },
                },
              },
            ],
          }
        : {};

    /*
    =====================================
    SEARCH FILTER
    =====================================
    */

    const searchFilter:
      Prisma.AllocationWhereInput =
      trimmedSearch
        ? {
            OR: [
              {
                allocationNumber: {
                  contains:
                    trimmedSearch,
                  mode: "insensitive",
                },
              },

              {
                cargoDescription: {
                  contains:
                    trimmedSearch,
                  mode: "insensitive",
                },
              },

              {
                commodityName: {
                  contains:
                    trimmedSearch,
                  mode: "insensitive",
                },
              },

              {
                client: {
                  companyName: {
                    contains:
                      trimmedSearch,
                    mode: "insensitive",
                  },
                },
              },

              /*
              Search by shipment number
              */

              {
                shipment: {
                  shipmentNumber: {
                    contains:
                      trimmedSearch,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {};

    /*
    =====================================
    FINAL WHERE
    =====================================
    */

    const where: Prisma.AllocationWhereInput =
      {
        ...shipmentVisibilityFilter,

        ...(status !== undefined && {
          status,
        }),

        ...(priority !== undefined && {
          priority,
        }),

        ...(serviceType !== undefined && {
          serviceType,
        }),

        ...(transportMode !== undefined && {
          transportMode,
        }),

        ...(clientId !== undefined && {
          clientId,
        }),

        ...(exporterId !== undefined && {
          exporterId,
        }),

        ...(consigneeId !== undefined && {
          consigneeId,
        }),

        ...(assignedToId !== undefined && {
          assignedToId,
        }),

        ...(createdById !== undefined && {
          createdById,
        }),

        ...(approvedById !== undefined && {
          approvedById,
        }),

        ...(isActive !== undefined && {
          isActive,
        }),

        ...searchFilter,
      };

    /*
    =====================================
    FETCH DATA + COUNT
    =====================================
    */

    const [data, total] =
      await Promise.all([
        prisma.allocation.findMany({
          where,

          include:
            this.listInclude,

          orderBy: {
            [sortBy]:
              sortOrder,
          },

          skip:
            (page - 1) * limit,

          take: limit,
        }),

        prisma.allocation.count({
          where,
        }),
      ]);

    /*
    =====================================
    RESPONSE
    =====================================
    */

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
              ? new Date(
                  data.pickupDate
                )
              : null
            : undefined,

        expectedShipmentDate:
          data.expectedShipmentDate !==
          undefined
            ? data.expectedShipmentDate
              ? new Date(
                  data.expectedShipmentDate
                )
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
  LIGHTWEIGHT INCLUDE
  =====================================

  Used by findAll().

  We intentionally do NOT load:

  - documents
  - containers
  - invoices
  - packing list
  - transits

  for every allocation in the list.

  Those relationships are loaded when
  viewing a single allocation.
  =====================================
  */

  private readonly listInclude =
    Prisma.validator<Prisma.AllocationInclude>()({
      /*
      =====================================
      Parties
      =====================================
      */

      client: true,

      exporter: true,

      consignee: true,

      /*
      =====================================
      Shipment
      =====================================
      */

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
              companyName: true,
            },
          },

          exporter: {
            select: {
              name: true,
            },
          },

          consignee: {
            select: {
              name: true,
            },
          },
        },
      },

      /*
      =====================================
      Created By
      =====================================
      */

      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      /*
      =====================================
      Assigned To
      =====================================
      */

      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      /*
      =====================================
      Approved By
      =====================================
      */

      approvedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      /*
      =====================================
      Counts
      =====================================
      */

      _count: {
        select: {
          attachedDocuments: true,
        },
      },
    });

  /*
  =====================================
  FULL INCLUDE
  =====================================

  Used by:

  - create()
  - findById()
  - update()
  - updateStatus()

  Gives the details page the complete
  allocation + shipment information.
  =====================================
  */

  private readonly include =
    Prisma.validator<Prisma.AllocationInclude>()({
      /*
      =====================================
      Parties
      =====================================
      */

      client: true,

      exporter: true,

      consignee: true,

      /*
      =====================================
      Shipment
      =====================================
      */

      shipment: {
        include: {
          /*
          Parties
          */

          client: true,

          exporter: true,

          consignee: true,

          /*
          Created By
          */

          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          /*
          Shipment Documents
          */

          documents: true,

          /*
          Containers
          */

          containers: {
            orderBy: {
              createdAt:
                Prisma.SortOrder.desc,
            },
          },

          /*
          Multiple Invoices
          */

          invoices: true,

          /*
          Packing List
          */

          packingList: true,

          /*
          Transits
          */

          transits: {
            orderBy: {
              createdAt:
                Prisma.SortOrder.desc,
            },
          },
        },
      },

      /*
      =====================================
      Allocation Documents
      =====================================
      */

      attachedDocuments: true,

      /*
      =====================================
      Created By
      =====================================
      */

      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      /*
      =====================================
      Assigned To
      =====================================
      */

      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      /*
      =====================================
      Approved By
      =====================================
      */

      approvedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      /*
      =====================================
      Counts
      =====================================
      */

      _count: {
        select: {
          attachedDocuments: true,
        },
      },
    });
}

export default new AllocationRepository();