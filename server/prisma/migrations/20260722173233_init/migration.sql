-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT', 'STAFF', 'OFFICER', 'VIEWER');

-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('COMPANY', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "AllocationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AllocationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('EXPORT_DOCUMENTATION', 'CUSTOMS_CLEARANCE', 'FREIGHT_FORWARDING', 'HAULAGE', 'CONTAINER_BOOKING', 'INSPECTION', 'WAREHOUSING', 'INSURANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "ContainerType" AS ENUM ('DRY', 'REEFER', 'OPEN_TOP', 'FLAT_RACK', 'TANK');

-- CreateEnum
CREATE TYPE "ContainerSize" AS ENUM ('FT20', 'FT40', 'FT40_HC', 'FT45');

-- CreateEnum
CREATE TYPE "ContainerStatus" AS ENUM ('EMPTY', 'LOADED', 'IN_TRANSIT', 'DELIVERED');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('DRAFT', 'READY', 'BOOKED', 'LOADED', 'IN_TRANSIT', 'ARRIVED', 'CUSTOMS_CLEARANCE', 'DELIVERED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransportMode" AS ENUM ('ROAD', 'SEA', 'AIR', 'RAIL');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('COMMERCIAL_INVOICE', 'PACKING_LIST', 'BILL_OF_LADING', 'NXP', 'XF', 'CCI', 'E_NUMBER', 'INSURANCE', 'INSPECTION_CERTIFICATE', 'EXPORT_PERMIT', 'CONTAINER_DOCUMENT', 'TRANSIT_INVOICE', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllocationDocument" (
    "id" TEXT NOT NULL,
    "allocationId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL DEFAULT 'OTHER',
    "fileName" TEXT NOT NULL,
    "originalName" TEXT,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT,
    "extension" TEXT,
    "fileSize" INTEGER,
    "remarks" TEXT,
    "uploadedById" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AllocationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exporter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "contactPerson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exporter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consignee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactPerson" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "transporter" TEXT,
    "placeOfLoading" TEXT NOT NULL,
    "transitRoute" TEXT NOT NULL,
    "portOfDischarge" TEXT NOT NULL,
    "transportMode" "TransportMode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consignee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "shipmentNumber" TEXT NOT NULL,
    "shipmentDate" TIMESTAMP(3) NOT NULL,
    "xfNumber" TEXT,
    "nxpNumber" TEXT,
    "cciNumber" TEXT,
    "eNumber" TEXT,
    "bookingNumber" TEXT,
    "transportMode" "TransportMode" NOT NULL,
    "shippingLine" TEXT,
    "vesselName" TEXT,
    "voyageNumber" TEXT,
    "portOfLoading" TEXT,
    "portOfDischarge" TEXT,
    "expectedDeparture" TIMESTAMP(3),
    "expectedArrival" TIMESTAMP(3),
    "actualDeparture" TIMESTAMP(3),
    "actualArrival" TIMESTAMP(3),
    "remarks" TEXT,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'DRAFT',
    "clientId" TEXT NOT NULL,
    "exporterId" TEXT NOT NULL,
    "consigneeId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "allocationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "currency" TEXT NOT NULL,
    "numberOfTrucks" INTEGER NOT NULL,
    "paymentTerms" TEXT,
    "incoterm" TEXT,
    "commercialReference" TEXT,
    "freight" DECIMAL(18,2) NOT NULL,
    "totalAmount" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Container" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "packingListId" TEXT,
    "containerNumber" TEXT NOT NULL,
    "sealNumber" TEXT,
    "containerType" "ContainerType" NOT NULL,
    "containerSize" "ContainerSize" NOT NULL,
    "grossWeight" DECIMAL(18,2),
    "netWeight" DECIMAL(18,2),
    "tareWeight" DECIMAL(18,2),
    "volume" DECIMAL(18,2),
    "loadingLocation" TEXT,
    "destination" TEXT,
    "status" "ContainerStatus" NOT NULL DEFAULT 'EMPTY',
    "shippingLine" TEXT,
    "bookingReference" TEXT,
    "containerCondition" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Container_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hsCode" TEXT,
    "packageType" TEXT,
    "packages" INTEGER,
    "grossWeight" DECIMAL(18,2),
    "netWeight" DECIMAL(18,2),
    "quantity" DECIMAL(18,2) NOT NULL,
    "unitPrice" DECIMAL(18,2) NOT NULL,
    "total" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackingList" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "packingListNumber" TEXT NOT NULL,
    "grossWeight" DECIMAL(18,2) NOT NULL,
    "netWeight" DECIMAL(18,2) NOT NULL,
    "totalPackages" INTEGER,
    "packageType" TEXT,
    "marksAndNumbers" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transit" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "containerId" TEXT,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "transportMode" "TransportMode" NOT NULL,
    "transporter" TEXT,
    "transitInvoice" TEXT,
    "agentNumber" TEXT,
    "exporterNumber" TEXT,
    "wibNumber" TEXT,
    "quantity" DECIMAL(18,2),
    "description" TEXT,
    "unitPrice" DECIMAL(18,2),
    "totalPrice" DECIMAL(18,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allocation" (
    "id" TEXT NOT NULL,
    "allocationNumber" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "exporterId" TEXT,
    "consigneeId" TEXT,
    "serviceType" "ServiceType" NOT NULL,
    "priority" "AllocationPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "AllocationStatus" NOT NULL DEFAULT 'PENDING',
    "cargoDescription" TEXT NOT NULL,
    "cargoType" TEXT,
    "commodityCode" TEXT,
    "commodityName" TEXT,
    "quantity" DECIMAL(18,2),
    "packageType" TEXT,
    "numberOfPackages" INTEGER,
    "grossWeight" DECIMAL(18,2),
    "netWeight" DECIMAL(18,2),
    "volume" DECIMAL(18,2),
    "originCountry" TEXT,
    "originCity" TEXT,
    "pickupAddress" TEXT,
    "pickupDate" TIMESTAMP(3),
    "destinationCountry" TEXT NOT NULL,
    "destinationCity" TEXT,
    "portOfLoading" TEXT,
    "portOfDischarge" TEXT,
    "transportMode" "TransportMode",
    "shippingLine" TEXT,
    "incoterm" TEXT,
    "deliveryAddress" TEXT,
    "expectedShipmentDate" TIMESTAMP(3),
    "estimatedValue" DECIMAL(18,2),
    "currency" TEXT,
    "paymentTerms" TEXT,
    "freightType" TEXT,
    "insuranceRequired" BOOLEAN NOT NULL DEFAULT false,
    "specialInstruction" TEXT,
    "internalRemark" TEXT,
    "destinationPort" TEXT,
    "createdById" TEXT NOT NULL,
    "assignedToId" TEXT,
    "approvedById" TEXT,
    "assignedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Allocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "clientCode" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "clientType" "ClientType" NOT NULL DEFAULT 'COMPANY',
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "alternatePhone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "website" TEXT,
    "taxNumber" TEXT,
    "remarks" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "remarks" TEXT,
    "shipmentId" TEXT,
    "containerId" TEXT,
    "invoiceId" TEXT,
    "packingListId" TEXT,
    "transitId" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "AllocationDocument_allocationId_idx" ON "AllocationDocument"("allocationId");

-- CreateIndex
CREATE INDEX "AllocationDocument_type_idx" ON "AllocationDocument"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_shipmentNumber_key" ON "Shipment"("shipmentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_allocationId_key" ON "Shipment"("allocationId");

-- CreateIndex
CREATE INDEX "Shipment_shipmentDate_idx" ON "Shipment"("shipmentDate");

-- CreateIndex
CREATE INDEX "Shipment_status_idx" ON "Shipment"("status");

-- CreateIndex
CREATE INDEX "Shipment_transportMode_idx" ON "Shipment"("transportMode");

-- CreateIndex
CREATE INDEX "Shipment_clientId_idx" ON "Shipment"("clientId");

-- CreateIndex
CREATE INDEX "Shipment_exporterId_idx" ON "Shipment"("exporterId");

-- CreateIndex
CREATE INDEX "Shipment_consigneeId_idx" ON "Shipment"("consigneeId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_shipmentId_key" ON "Invoice"("shipmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Container_containerNumber_key" ON "Container"("containerNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PackingList_shipmentId_key" ON "PackingList"("shipmentId");

-- CreateIndex
CREATE UNIQUE INDEX "PackingList_packingListNumber_key" ON "PackingList"("packingListNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Allocation_allocationNumber_key" ON "Allocation"("allocationNumber");

-- CreateIndex
CREATE INDEX "Allocation_clientId_idx" ON "Allocation"("clientId");

-- CreateIndex
CREATE INDEX "Allocation_exporterId_idx" ON "Allocation"("exporterId");

-- CreateIndex
CREATE INDEX "Allocation_consigneeId_idx" ON "Allocation"("consigneeId");

-- CreateIndex
CREATE INDEX "Allocation_status_idx" ON "Allocation"("status");

-- CreateIndex
CREATE INDEX "Allocation_priority_idx" ON "Allocation"("priority");

-- CreateIndex
CREATE INDEX "Allocation_serviceType_idx" ON "Allocation"("serviceType");

-- CreateIndex
CREATE INDEX "Allocation_createdById_idx" ON "Allocation"("createdById");

-- CreateIndex
CREATE INDEX "Allocation_assignedToId_idx" ON "Allocation"("assignedToId");

-- CreateIndex
CREATE INDEX "Allocation_approvedById_idx" ON "Allocation"("approvedById");

-- CreateIndex
CREATE INDEX "Allocation_expectedShipmentDate_idx" ON "Allocation"("expectedShipmentDate");

-- CreateIndex
CREATE INDEX "Allocation_createdAt_idx" ON "Allocation"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Client_clientCode_key" ON "Client"("clientCode");

-- CreateIndex
CREATE INDEX "Document_shipmentId_idx" ON "Document"("shipmentId");

-- CreateIndex
CREATE INDEX "Document_containerId_idx" ON "Document"("containerId");

-- CreateIndex
CREATE INDEX "Document_invoiceId_idx" ON "Document"("invoiceId");

-- CreateIndex
CREATE INDEX "Document_packingListId_idx" ON "Document"("packingListId");

-- CreateIndex
CREATE INDEX "Document_transitId_idx" ON "Document"("transitId");

-- AddForeignKey
ALTER TABLE "AllocationDocument" ADD CONSTRAINT "AllocationDocument_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "Allocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllocationDocument" ADD CONSTRAINT "AllocationDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_exporterId_fkey" FOREIGN KEY ("exporterId") REFERENCES "Exporter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_consigneeId_fkey" FOREIGN KEY ("consigneeId") REFERENCES "Consignee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "Allocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES "PackingList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingList" ADD CONSTRAINT "PackingList_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transit" ADD CONSTRAINT "Transit_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transit" ADD CONSTRAINT "Transit_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_exporterId_fkey" FOREIGN KEY ("exporterId") REFERENCES "Exporter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_consigneeId_fkey" FOREIGN KEY ("consigneeId") REFERENCES "Consignee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES "PackingList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_transitId_fkey" FOREIGN KEY ("transitId") REFERENCES "Transit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
