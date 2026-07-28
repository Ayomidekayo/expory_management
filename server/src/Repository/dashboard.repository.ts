import { prisma } from "../config/prisma";

class DashboardRepository {
  /*
  =====================================
  Statistics
  =====================================
  */

async getStatistics() {
  const [
    allocations,
    shipments,
    invoices,
    clients,
    containers,
    documents,
  ] = await Promise.all([
    prisma.allocation.count(),
    prisma.shipment.count(),
    prisma.invoice.count(),
    prisma.client.count(),
    prisma.container.count(),
    prisma.document.count(),
  ]);

  return {
    allocations,
    shipments,
    invoices,
    clients,
    containers,
    documents,
  };
}

  async getShipmentStatus() {
  const data =
    await prisma.shipment.groupBy({
      by: ["status"],

      _count: {
        status: true,
      },
    });

  return data.map((item) => ({
    name: item.status,

    value: item._count.status,
  }));
}

async getAllocationStatus() {
  const data =
    await prisma.allocation.groupBy({
      by: ["status"],

      _count: {
        status: true,
      },
    });

  return data.map((item) => ({
    name: item.status,

    value: item._count.status,
  }));
}
async getTransportModes() {
  const data =
    await prisma.shipment.groupBy({
      by: ["transportMode"],

      _count: {
        transportMode: true,
      },
    });

  return data.map((item) => ({
    name: item.transportMode,

    value: item._count.transportMode,
  }));
}
async getUpcomingShipments() {
  return prisma.shipment.findMany({
    where: {
      expectedDeparture: {
        gte: new Date(),
      },
    },

    include: {
      client: {
        select: {
          companyName: true,
        },
      },
    },

    orderBy: {
      expectedDeparture: "asc",
    },

    take: 5,
  });
}
async getRecentActivities() {

  const [
    shipments,
    invoices,
    documents,
  ] = await Promise.all([

    prisma.shipment.findMany({

      take: 5,

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        shipmentNumber: true,
        createdAt: true,
      },
    }),

    prisma.invoice.findMany({

      take: 5,

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        invoiceNumber: true,
        createdAt: true,
      },
    }),

    prisma.document.findMany({

      take: 5,

      orderBy: {
        uploadedAt: "desc",
      },

      select: {
        id: true,
        fileName: true,
        uploadedAt: true,
      },
    }),
  ]);

  return {
    shipments,

    invoices,

    documents,
  };
}
async getTopClients() {

  const clients =
    await prisma.client.findMany({

      include: {

        _count: {

          select: {
            shipments: true,
          },
        },
      },

      orderBy: {

        shipments: {

          _count: "desc",
        },
      },

      take: 5,
    });

  return clients;
}
async getRevenueTrend() {

  const invoices =
    await prisma.invoice.findMany({

      select: {

        invoiceDate: true,

        totalAmount: true,
      },

      orderBy: {

        invoiceDate: "asc",
      },
    });

  return invoices;
}
async getShipmentTrend() {

  return prisma.shipment.findMany({

    select: {

      shipmentDate: true,
    },

    orderBy: {

      shipmentDate: "asc",
    },
  });
}

}

export default new DashboardRepository();