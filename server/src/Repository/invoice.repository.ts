import { InvoiceStatus, Prisma } from "../generated";
import { prisma } from "../config/prisma";

import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
} from "../validations/invoice.validation";

import { InvoiceQuery } from "../validations/invoice-query.validation";

class InvoiceRepository {
  /*
  =====================================
  Create
  =====================================
  */

 async create(
  data: CreateInvoiceDto & {
    invoiceNumber: string;
  }
) {
  const items = data.items.map((item) => ({
    ...item,

    total:
      Number(item.quantity) *
      Number(item.unitPrice),
  }));

  const subtotal = items.reduce(
    (sum, item) =>
      sum + Number(item.total),
    0
  );

  const totalAmount =
    subtotal +
    Number(data.freight);

  return prisma.invoice.create({
    data: {
      shipmentId:
        data.shipmentId,

      // System-generated invoice number
      invoiceNumber:
        data.invoiceNumber,

      // Client/vendor invoice number
      externalInvoiceNumber:
        data.externalInvoiceNumber || null,

      invoiceDate: new Date(
        data.invoiceDate
      ),

      currency:
        data.currency,

      exchangeRate:
        data.exchangeRate,

      status:
        data.status ?? "UNPAID",

      paymentTerms:
        data.paymentTerms,

      incoterm:
        data.incoterm,

      commercialReference:
        data.commercialReference,

      transportUnits:
        data.transportUnits,

      freight:
        data.freight,

      subtotal,

      totalAmount,

      remarks:
        data.remarks,

      items: {
        create: items,
      },
    },

    include:
      this.detailsInclude,
  });
}

  /*
  =====================================
  Latest Invoice
  =====================================
  */

  async findLatestInvoice() {
    return prisma.invoice.findFirst({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        invoiceNumber: true,
      },
    });
  }

  /*
  =====================================
  Find All
  =====================================
  */

  async findAll(
    query: InvoiceQuery
  ) {
    const {
      page,
      limit,
      search,
      status,
      currency,
      shipmentId,
      fromDate,
      toDate,
      datePreset,
      sortBy,
      sortOrder,
    } = query;

    let startDate:
      | Date
      | undefined;

    let endDate:
      | Date
      | undefined;

    const today = new Date();

    switch (datePreset) {
      case "TODAY":
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(today);
        endDate.setHours(
          23,
          59,
          59,
          999
        );

        break;

      case "THIS_WEEK":
        startDate = new Date(today);

        startDate.setDate(
          today.getDate() -
            today.getDay()
        );

        startDate.setHours(
          0,
          0,
          0,
          0
        );

        endDate = new Date(startDate);

        endDate.setDate(
          startDate.getDate() + 6
        );

        endDate.setHours(
          23,
          59,
          59,
          999
        );

        break;

      case "THIS_MONTH":
        startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );

        endDate = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );

        break;

      case "THIS_QUARTER": {
        const quarter =
          Math.floor(
            today.getMonth() / 3
          ) * 3;

        startDate = new Date(
          today.getFullYear(),
          quarter,
          1
        );

        endDate = new Date(
          today.getFullYear(),
          quarter + 3,
          0,
          23,
          59,
          59,
          999
        );

        break;
      }

      case "THIS_YEAR":
        startDate = new Date(
          today.getFullYear(),
          0,
          1
        );

        endDate = new Date(
          today.getFullYear(),
          11,
          31,
          23,
          59,
          59,
          999
        );

        break;
    }

    const where: Prisma.InvoiceWhereInput = {
      ...(status && {
        status,
      }),

      ...(currency && {
        currency,
      }),

      ...(shipmentId && {
        shipmentId,
      }),

      ...(search && {
        OR: [
          {
            invoiceNumber: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            commercialReference: {
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

      ...((fromDate ||
        toDate ||
        startDate) && {
        invoiceDate: {
          ...(fromDate
            ? {
                gte: new Date(
                  fromDate
                ),
              }
            : startDate
            ? {
                gte: startDate,
              }
            : {}),

          ...(toDate
            ? {
                lte: new Date(
                  toDate
                ),
              }
            : endDate
            ? {
                lte: endDate,
              }
            : {}),
        },
      }),
    };

    const [data, total] =
      await Promise.all([
        prisma.invoice.findMany({
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

        prisma.invoice.count({
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
  Find One
  =====================================
  */

  async findById(id: string) {
    return prisma.invoice.findUnique({
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

/*
=====================================
Find All Invoices By Shipment
=====================================
*/

async findByShipmentId(
  shipmentId: string
) {
  return prisma.invoice.findMany({
    where: {
      shipmentId,
    },

    include: this.detailsInclude,

    orderBy: {
      createdAt: "asc",
    },
  });
}

  /*
  =====================================
  Update Status
  =====================================
  */

 async updateStatus(
  id: string,
  status: InvoiceStatus
) {
  return prisma.invoice.update({
    where: {
      id,
    },

    data: {
      status,
    },

    include: this.detailsInclude,
  });
}
  /*
  =====================================
  Update
  =====================================
  */

/* =====================================
   Update Invoice
===================================== */

async update(
  id: string,
  data: UpdateInvoiceDto
) {
  const existingInvoice =
    await this.findById(id);

  if (!existingInvoice) {
    throw new Error(
      "Invoice not found."
    );
  }

  /*
   * =====================================
   * Prepare invoice items
   * =====================================
   */

  let items:
    | {
        description: string;
        hsCode?: string;
        packageType?: string;
        packages?: number;
        grossWeight?: number;
        netWeight?: number;
        quantity: number;
        unit?: string;
        unitPrice: number;
        total: number;
        remarks?: string;
      }[]
    | undefined;

  let subtotal:
    | number
    | undefined;

  let totalAmount:
    | number
    | undefined;

  /*
   * Only replace invoice items when
   * items were included in the request.
   */

  if (data.items !== undefined) {
    items = data.items.map((item) => ({
      description:
        item.description,

      hsCode:
        item.hsCode || undefined,

      packageType:
        item.packageType || undefined,

      packages:
        item.packages,

      grossWeight:
        item.grossWeight,

      netWeight:
        item.netWeight,

      quantity:
        Number(item.quantity),

      unit:
        item.unit || undefined,

      unitPrice:
        Number(item.unitPrice),

      total:
        Number(item.quantity) *
        Number(item.unitPrice),

      remarks:
        item.remarks || undefined,
    }));

    /*
     * Calculate subtotal from ALL items.
     */

    subtotal = items.reduce(
      (sum, item) =>
        sum + item.total,
      0
    );

    /*
     * Calculate grand total.
     */

    totalAmount =
      subtotal +
      Number(
        data.freight ??
          existingInvoice.freight
      );
  }

  /*
   * =====================================
   * Update invoice
   * =====================================
   */

  return prisma.invoice.update({
    where: {
      id,
    },

    data: {
      invoiceDate:
        data.invoiceDate
          ? new Date(
              data.invoiceDate
            )
          : undefined,

      externalInvoiceNumber:
        data.externalInvoiceNumber !==
        undefined
          ? data.externalInvoiceNumber ||
            null
          : undefined,

      currency:
        data.currency,

      exchangeRate:
        data.exchangeRate,

      paymentTerms:
        data.paymentTerms,

      status:
        data.status,

      incoterm:
        data.incoterm,

      commercialReference:
        data.commercialReference,

      transportUnits:
        data.transportUnits,

      freight:
        data.freight,

      remarks:
        data.remarks,

      /*
       * =================================
       * Replace ALL invoice items
       * =================================
       */

      ...(items !== undefined && {
        subtotal,

        totalAmount,

        items: {
          deleteMany: {},

          create: items,
        },
      }),
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
    return prisma.invoice.delete({
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

    _count: {
      select: {
        items: true,
        documents: true,
      },
    },
  };
}

export default new InvoiceRepository();