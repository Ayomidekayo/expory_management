-- CreateEnum
CREATE TYPE "TransportItemType" AS ENUM ('TRUCK', 'CONTAINER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'ADVANCE', 'PARTIALLY_PAID', 'PAID');

-- CreateEnum
CREATE TYPE "ItemPaymentType" AS ENUM ('ADVANCE', 'REGULAR');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Permission" ADD VALUE 'VIEW_TRANSPORTS';
ALTER TYPE "Permission" ADD VALUE 'CREATE_TRANSPORT';
ALTER TYPE "Permission" ADD VALUE 'EDIT_TRANSPORT';
ALTER TYPE "Permission" ADD VALUE 'DELETE_TRANSPORT';
ALTER TYPE "Permission" ADD VALUE 'MANAGE_TRANSPORT_PAYMENTS';
ALTER TYPE "Permission" ADD VALUE 'VIEW_TRANSIT_IN';
ALTER TYPE "Permission" ADD VALUE 'CREATE_TRANSIT_IN';
ALTER TYPE "Permission" ADD VALUE 'EDIT_TRANSIT_IN';
ALTER TYPE "Permission" ADD VALUE 'DELETE_TRANSIT_IN';
ALTER TYPE "Permission" ADD VALUE 'MANAGE_TRANSIT_IN_PAYMENTS';
ALTER TYPE "Permission" ADD VALUE 'VIEW_TRANSIT_OUT';
ALTER TYPE "Permission" ADD VALUE 'CREATE_TRANSIT_OUT';
ALTER TYPE "Permission" ADD VALUE 'EDIT_TRANSIT_OUT';
ALTER TYPE "Permission" ADD VALUE 'DELETE_TRANSIT_OUT';
ALTER TYPE "Permission" ADD VALUE 'MANAGE_TRANSIT_OUT_PAYMENTS';
ALTER TYPE "Permission" ADD VALUE 'LOCK_TRANSPORT_ITEMS';
ALTER TYPE "Permission" ADD VALUE 'LOCK_TRANSIT_IN_ITEMS';
ALTER TYPE "Permission" ADD VALUE 'LOCK_TRANSIT_OUT_ITEMS';

-- CreateTable
CREATE TABLE "Transport" (
    "id" TEXT NOT NULL,
    "transportNumber" TEXT NOT NULL,
    "transportDate" TIMESTAMP(3) NOT NULL,
    "shipmentId" TEXT,
    "remarks" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportItem" (
    "id" TEXT NOT NULL,
    "transportId" TEXT NOT NULL,
    "itemDate" TIMESTAMP(3) NOT NULL,
    "itemType" "TransportItemType" NOT NULL,
    "name" TEXT,
    "ownerName" TEXT NOT NULL,
    "frontPlateNumber" TEXT,
    "backPlateNumber" TEXT,
    "containerName" TEXT,
    "containerNumber" TEXT,
    "chargeAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "chargeCurrency" "Currency" NOT NULL DEFAULT 'NGN',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "remarks" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedFields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransportItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportPayment" (
    "id" TEXT NOT NULL,
    "transportItemId" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "paymentType" "ItemPaymentType" NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT,
    "reference" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransportPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransitIn" (
    "id" TEXT NOT NULL,
    "transitInNumber" TEXT NOT NULL,
    "transitDate" TIMESTAMP(3) NOT NULL,
    "shipmentId" TEXT,
    "remarks" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransitIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransitInItem" (
    "id" TEXT NOT NULL,
    "transitInId" TEXT NOT NULL,
    "itemDate" TIMESTAMP(3) NOT NULL,
    "itemType" "TransportItemType" NOT NULL,
    "name" TEXT,
    "ownerName" TEXT NOT NULL,
    "frontPlateNumber" TEXT,
    "backPlateNumber" TEXT,
    "containerName" TEXT,
    "containerNumber" TEXT,
    "chargeAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "chargeCurrency" "Currency" NOT NULL DEFAULT 'NGN',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "remarks" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedFields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransitInItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransitInPayment" (
    "id" TEXT NOT NULL,
    "transitInItemId" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "paymentType" "ItemPaymentType" NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT,
    "reference" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransitInPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransitOut" (
    "id" TEXT NOT NULL,
    "transitOutNumber" TEXT NOT NULL,
    "transitDate" TIMESTAMP(3) NOT NULL,
    "shipmentId" TEXT,
    "remarks" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransitOut_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransitOutItem" (
    "id" TEXT NOT NULL,
    "transitOutId" TEXT NOT NULL,
    "itemDate" TIMESTAMP(3) NOT NULL,
    "itemType" "TransportItemType" NOT NULL,
    "name" TEXT,
    "ownerName" TEXT NOT NULL,
    "frontPlateNumber" TEXT,
    "backPlateNumber" TEXT,
    "containerName" TEXT,
    "containerNumber" TEXT,
    "chargeAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "chargeCurrency" "Currency" NOT NULL DEFAULT 'NGN',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "remarks" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedFields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransitOutItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransitOutPayment" (
    "id" TEXT NOT NULL,
    "transitOutItemId" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "paymentType" "ItemPaymentType" NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT,
    "reference" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransitOutPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transport_transportNumber_key" ON "Transport"("transportNumber");

-- CreateIndex
CREATE INDEX "Transport_shipmentId_idx" ON "Transport"("shipmentId");

-- CreateIndex
CREATE INDEX "Transport_transportDate_idx" ON "Transport"("transportDate");

-- CreateIndex
CREATE INDEX "Transport_createdAt_idx" ON "Transport"("createdAt");

-- CreateIndex
CREATE INDEX "TransportItem_transportId_idx" ON "TransportItem"("transportId");

-- CreateIndex
CREATE INDEX "TransportItem_itemDate_idx" ON "TransportItem"("itemDate");

-- CreateIndex
CREATE INDEX "TransportItem_itemType_idx" ON "TransportItem"("itemType");

-- CreateIndex
CREATE INDEX "TransportItem_paymentStatus_idx" ON "TransportItem"("paymentStatus");

-- CreateIndex
CREATE INDEX "TransportPayment_transportItemId_idx" ON "TransportPayment"("transportItemId");

-- CreateIndex
CREATE INDEX "TransportPayment_paymentDate_idx" ON "TransportPayment"("paymentDate");

-- CreateIndex
CREATE UNIQUE INDEX "TransitIn_transitInNumber_key" ON "TransitIn"("transitInNumber");

-- CreateIndex
CREATE INDEX "TransitIn_shipmentId_idx" ON "TransitIn"("shipmentId");

-- CreateIndex
CREATE INDEX "TransitIn_transitDate_idx" ON "TransitIn"("transitDate");

-- CreateIndex
CREATE INDEX "TransitIn_createdAt_idx" ON "TransitIn"("createdAt");

-- CreateIndex
CREATE INDEX "TransitInItem_transitInId_idx" ON "TransitInItem"("transitInId");

-- CreateIndex
CREATE INDEX "TransitInItem_itemDate_idx" ON "TransitInItem"("itemDate");

-- CreateIndex
CREATE INDEX "TransitInItem_itemType_idx" ON "TransitInItem"("itemType");

-- CreateIndex
CREATE INDEX "TransitInItem_paymentStatus_idx" ON "TransitInItem"("paymentStatus");

-- CreateIndex
CREATE INDEX "TransitInPayment_transitInItemId_idx" ON "TransitInPayment"("transitInItemId");

-- CreateIndex
CREATE INDEX "TransitInPayment_paymentDate_idx" ON "TransitInPayment"("paymentDate");

-- CreateIndex
CREATE UNIQUE INDEX "TransitOut_transitOutNumber_key" ON "TransitOut"("transitOutNumber");

-- CreateIndex
CREATE INDEX "TransitOut_shipmentId_idx" ON "TransitOut"("shipmentId");

-- CreateIndex
CREATE INDEX "TransitOut_transitDate_idx" ON "TransitOut"("transitDate");

-- CreateIndex
CREATE INDEX "TransitOut_createdAt_idx" ON "TransitOut"("createdAt");

-- CreateIndex
CREATE INDEX "TransitOutItem_transitOutId_idx" ON "TransitOutItem"("transitOutId");

-- CreateIndex
CREATE INDEX "TransitOutItem_itemDate_idx" ON "TransitOutItem"("itemDate");

-- CreateIndex
CREATE INDEX "TransitOutItem_itemType_idx" ON "TransitOutItem"("itemType");

-- CreateIndex
CREATE INDEX "TransitOutItem_paymentStatus_idx" ON "TransitOutItem"("paymentStatus");

-- CreateIndex
CREATE INDEX "TransitOutPayment_transitOutItemId_idx" ON "TransitOutPayment"("transitOutItemId");

-- CreateIndex
CREATE INDEX "TransitOutPayment_paymentDate_idx" ON "TransitOutPayment"("paymentDate");

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportItem" ADD CONSTRAINT "TransportItem_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportPayment" ADD CONSTRAINT "TransportPayment_transportItemId_fkey" FOREIGN KEY ("transportItemId") REFERENCES "TransportItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitIn" ADD CONSTRAINT "TransitIn_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitInItem" ADD CONSTRAINT "TransitInItem_transitInId_fkey" FOREIGN KEY ("transitInId") REFERENCES "TransitIn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitInPayment" ADD CONSTRAINT "TransitInPayment_transitInItemId_fkey" FOREIGN KEY ("transitInItemId") REFERENCES "TransitInItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitOut" ADD CONSTRAINT "TransitOut_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitOutItem" ADD CONSTRAINT "TransitOutItem_transitOutId_fkey" FOREIGN KEY ("transitOutId") REFERENCES "TransitOut"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitOutPayment" ADD CONSTRAINT "TransitOutPayment_transitOutItemId_fkey" FOREIGN KEY ("transitOutItemId") REFERENCES "TransitOutItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
