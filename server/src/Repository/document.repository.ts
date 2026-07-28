import { Prisma } from "../generated";
import { prisma } from "../config/prisma";

import {
  CreateDocumentDto,
  UpdateDocumentDto,
} from "../validations/document.validation";

import {
  DocumentQuery,
} from "../validations/document-query.validation";

class DocumentRepository {
  /*
  =====================================
  Create
  =====================================
  */

  async create(
    data: CreateDocumentDto & {
      fileName: string;
      fileUrl: string;
      mimeType?: string;
      fileSize?: number;
    }
  ) {
    return prisma.document.create({
      data: {
        type: data.type,

        fileName: data.fileName,

        fileUrl: data.fileUrl,

        mimeType: data.mimeType,

        fileSize: data.fileSize,

        remarks: data.remarks,

        shipmentId: data.shipmentId,

        containerId: data.containerId,

        packingListId: data.packingListId,

        invoiceId: data.invoiceId,

        transitId: data.transitId,
        allocationId: data.allocationId,
      },

      include: this.detailsInclude,
    });
  }

  /*
  =====================================
  Find All
  =====================================
  */

  async findAll(
    query: DocumentQuery
  ) {
    const {
      page,
      limit,
      search,
      shipmentId,
      containerId,
      packingListId,
      invoiceId,
      transitId,
      type,
      sortBy,
      sortOrder,
    } = query;

    const where: Prisma.DocumentWhereInput = {
      ...(shipmentId && {
        shipmentId,
      }),

      ...(containerId && {
        containerId,
      }),

      ...(packingListId && {
        packingListId,
      }),

      ...(invoiceId && {
        invoiceId,
      }),

      ...(transitId && {
        transitId,
      }),

      ...(type && {
        type,
      }),

      ...(search && {
        OR: [
          {
            fileName: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            remarks: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    const [data, total] =
      await Promise.all([
        prisma.document.findMany({
          where,

          include: this.listInclude,

          orderBy: {
            [sortBy]: sortOrder,
          },

          skip:
            (page - 1) * limit,

          take: limit,
        }),

        prisma.document.count({
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
  console.log("REPOSITORY FIND:", id);

  return prisma.document.findUnique({
    where: {
      id,
    },
    include: this.detailsInclude,
  });
}

  /*
  =====================================
  Update
  =====================================
  */

  async update(
    id: string,
    data: UpdateDocumentDto
  ) {
    return prisma.document.update({
      where: {
        id,
      },

      data,

      include: this.detailsInclude,
    });
  }

  /*
  =====================================
  Delete
  =====================================
  */

  async delete(id: string) {
    return prisma.document.delete({
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
      },
    },

    container: {
      select: {
        id: true,
        containerNumber: true,
      },
    },

    packingList: {
      select: {
        id: true,
        packingListNumber: true,
      },
    },

    invoice: {
      select: {
        id: true,
        invoiceNumber: true,
      },
    },

    transit: {
      select: {
        id: true,
        transitNumber: true,
      },
    },
  };

  /*
  =====================================
  DETAILS INCLUDE
  =====================================
  */

  private detailsInclude = {
    allocation: {
  select: {
    id: true,
    allocationNumber: true,
  },
},
    shipment: true,

    container: true,

    packingList: true,

    invoice: true,

    transit: true,
  };
}

export default new DocumentRepository();