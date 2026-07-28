// prisma/seed.ts

import bcrypt from "bcrypt";
import { prisma } from "../src/config/prisma";

async function main() {
  console.log("🌱 Starting seed...");

  const password = await bcrypt.hash(
    "password123",
    10
  );

  /*
  ============================================
  USERS
  ============================================
  */

  await prisma.user.createMany({
    skipDuplicates: true,

    data: [
      {
        name: "System Admin",
        email: "admin@obest.com",
        password,
        role: "ADMIN",
      },

      {
        name: "John Manager",
        email: "manager@obest.com",
        password,
        role: "STAFF",
      },

      {
        name: "Sarah Officer",
        email: "officer@obest.com",
        password,
        role: "OFFICER",
      },

      {
        name: "Viewer User",
        email: "viewer@obest.com",
        password,
        role: "VIEWER",
      },

      {
        name: "Client User",
        email: "client@obest.com",
        password,
        role: "CLIENT",
      },
    ],
  });

  console.log("✅ Users seeded");

  /*
  ============================================
  CLIENTS
  ============================================
  */

  await prisma.client.createMany({
    skipDuplicates: true,

    data: [
      {
        clientCode: "CLI-001",

        companyName:
          "Dangote Industries",

        clientType: "COMPANY",

        contactPerson:
          "Aliko Musa",

        email:
          "exports@dangote.com",

        phone: "08030000001",

        address: "Lagos",

        city: "Lagos",

        state: "Lagos",

        country: "Nigeria",
      },

      {
        clientCode: "CLI-002",

        companyName:
          "BUA Foods",

        clientType: "COMPANY",

        contactPerson:
          "Ahmed Bello",

        email:
          "exports@bua.com",

        phone: "08030000002",

        address: "Abuja",

        city: "Abuja",

        state: "FCT",

        country: "Nigeria",
      },

      {
        clientCode: "CLI-003",

        companyName:
          "Flour Mills",

        clientType: "COMPANY",

        contactPerson:
          "Samuel James",

        email:
          "trade@flourmills.com",

        phone: "08030000003",

        address: "Apapa",

        city: "Lagos",

        state: "Lagos",

        country: "Nigeria",
      },

      {
        clientCode: "CLI-004",

        companyName:
          "Olam Nigeria",

        clientType: "COMPANY",

        contactPerson:
          "Grace Obi",

        email:
          "shipping@olam.com",

        phone: "08030000004",

        address: "Lekki",

        city: "Lagos",

        state: "Lagos",

        country: "Nigeria",
      },

      {
        clientCode: "CLI-005",

        companyName:
          "African Export Ltd",

        clientType: "COMPANY",

        contactPerson:
          "Paul Okoro",

        email:
          "info@africanexport.com",

        phone: "08030000005",

        address:
          "Port Harcourt",

        city:
          "Port Harcourt",

        state: "Rivers",

        country: "Nigeria",
      },
    ],
  });

  console.log("✅ Clients seeded");

  /*
  ============================================
  EXPORTERS
  ============================================
  */

  await prisma.exporter.createMany({
    skipDuplicates: true,

    data: [
      {
        name:
          "Golden Export Ltd",

        address: "Lagos",

        phone: "08011111111",

        email:
          "golden@export.com",

        contactPerson:
          "John Doe",
      },

      {
        name:
          "Prime Agro Export",

        address: "Ibadan",

        phone: "08022222222",

        email:
          "prime@export.com",

        contactPerson:
          "Mary James",
      },

      {
        name:
          "West Africa Commodities",

        address: "Kano",

        phone: "08033333333",

        email:
          "west@export.com",

        contactPerson:
          "Ahmed Musa",
      },

      {
        name:
          "Ocean Gate Export",

        address:
          "Port Harcourt",

        phone: "08044444444",

        email:
          "ocean@export.com",

        contactPerson:
          "Peter Obi",
      },

      {
        name:
          "Unity Export Company",

        address: "Lagos",

        phone: "08055555555",

        email:
          "unity@export.com",

        contactPerson:
          "Sarah Johnson",
      },
    ],
  });

  console.log("✅ Exporters seeded");

  /*
  ============================================
  CONSIGNEES
  ============================================
  */

  await prisma.consignee.createMany({
    skipDuplicates: true,

    data: [
      {
        name:
          "Shanghai Trading Ltd",

        contactPerson:
          "Li Wei",

        phone:
          "+86123456789",

        email:
          "contact@shanghai.com",

        address:
          "Shanghai, China",

        transporter: "MSC",

        placeOfLoading:
          "Apapa Port",

        transitRoute:
          "Nigeria - China",

        portOfDischarge:
          "Shanghai Port",

        transportMode:
          "SEA",
      },

      {
        name:
          "Dubai Global Imports",

        contactPerson:
          "Ali Hassan",

        phone:
          "+971500000001",

        email:
          "info@dubai.ae",

        address:
          "Dubai",

        transporter:
          "MAERSK",

        placeOfLoading:
          "Tin Can",

        transitRoute:
          "Nigeria - UAE",

        portOfDischarge:
          "Jebel Ali",

        transportMode:
          "SEA",
      },

      {
        name:
          "UK Agro Imports",

        contactPerson:
          "James Brown",

        phone:
          "+447700900001",

        email:
          "sales@ukagro.co.uk",

        address:
          "London",

        transporter:
          "CMA CGM",

        placeOfLoading:
          "Apapa",

        transitRoute:
          "Nigeria - UK",

        portOfDischarge:
          "London Gateway",

        transportMode:
          "SEA",
      },

      {
        name:
          "Canada Food Supplies",

        contactPerson:
          "Mark Wilson",

        phone:
          "+14165550001",

        email:
          "info@canadafoods.ca",

        address:
          "Toronto",

        transporter:
          "Hapag Lloyd",

        placeOfLoading:
          "Onne Port",

        transitRoute:
          "Nigeria - Canada",

        portOfDischarge:
          "Toronto Port",

        transportMode:
          "SEA",
      },

      {
        name:
          "Germany Commodities",

        contactPerson:
          "Hans Muller",

        phone:
          "+491511234567",

        email:
          "office@germany.de",

        address:
          "Hamburg",

        transporter:
          "MSC",

        placeOfLoading:
          "Apapa",

        transitRoute:
          "Nigeria - Germany",

        portOfDischarge:
          "Hamburg",

        transportMode:
          "SEA",
      },
    ],
  });

  console.log("✅ Consignees seeded");

  /*
  ============================================
  FETCH RECORDS FOR RELATIONSHIPS
  ============================================
  */

  const users = await prisma.user.findMany();

  const clients =
    await prisma.client.findMany();

  const exporters =
    await prisma.exporter.findMany();

  const consignees =
    await prisma.consignee.findMany();

  // Part 2 starts here...
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });