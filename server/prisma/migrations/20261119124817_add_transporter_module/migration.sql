-- CreateEnum
CREATE TYPE "TransporterStatus" AS ENUM ('PENDING', 'LOADING', 'IN_TRANSIT', 'OFFLOADING', 'COMPLETED', 'CANCELLED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Permission" ADD VALUE 'VIEW_TRANSPORTERS';
ALTER TYPE "Permission" ADD VALUE 'CREATE_TRANSPORTER';
ALTER TYPE "Permission" ADD VALUE 'EDIT_TRANSPORTER';
ALTER TYPE "Permission" ADD VALUE 'DELETE_TRANSPORTER';
ALTER TYPE "Permission" ADD VALUE 'MANAGE_TRANSPORTER_PAYMENTS';

-- CreateTable
CREATE TABLE "TransporterItemColumnLock" (
    "id" TEXT NOT NULL,
    "columnKey" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "lockedById" TEXT,
    "lockReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransporterItemColumnLock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transporter" (
    "id" TEXT NOT NULL,
    "transportNumber" TEXT NOT NULL,
    "transportDate" TIMESTAMP(3) NOT NULL,
    "truckOwnerName" TEXT NOT NULL,
    "shipmentId" TEXT,
    "remarks" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transporter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransporterItem" (
    "id" TEXT NOT NULL,
    "transporterId" TEXT NOT NULL,
    "itemDate" TIMESTAMP(3) NOT NULL,
    "itemType" "TransportItemType" NOT NULL,
    "name" TEXT,
    "frontPlateNumber" TEXT,
    "backPlateNumber" TEXT,
    "containerName" TEXT,
    "containerNumber" TEXT,
    "status" "TransporterStatus" NOT NULL DEFAULT 'PENDING',
    "chargeAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "chargeCurrency" "Currency" NOT NULL DEFAULT 'NGN',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "remarks" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedFields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransporterItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransporterPayment" (
    "id" TEXT NOT NULL,
    "transportItemId" TEXT NOT NULL,
    "recordedById" TEXT,
    "amount" DECIMAL(18,2) NOT NULL,
    "paymentType" "ItemPaymentType" NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT,
    "reference" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransporterPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransporterItemColumnLock_columnKey_key" ON "TransporterItemColumnLock"("columnKey");

-- CreateIndex
CREATE INDEX "TransporterItemColumnLock_isLocked_idx" ON "TransporterItemColumnLock"("isLocked");

-- CreateIndex
CREATE INDEX "TransporterItemColumnLock_lockedById_idx" ON "TransporterItemColumnLock"("lockedById");

-- CreateIndex
CREATE UNIQUE INDEX "Transporter_transportNumber_key" ON "Transporter"("transportNumber");

-- CreateIndex
CREATE INDEX "Transporter_shipmentId_idx" ON "Transporter"("shipmentId");

-- CreateIndex
CREATE INDEX "Transporter_transportDate_idx" ON "Transporter"("transportDate");

-- CreateIndex
CREATE INDEX "Transporter_createdAt_idx" ON "Transporter"("createdAt");

-- CreateIndex
CREATE INDEX "TransporterItem_transporterId_idx" ON "TransporterItem"("transporterId");

-- CreateIndex
CREATE INDEX "TransporterItem_itemDate_idx" ON "TransporterItem"("itemDate");

-- CreateIndex
CREATE INDEX "TransporterItem_itemType_idx" ON "TransporterItem"("itemType");

-- CreateIndex
CREATE INDEX "TransporterItem_status_idx" ON "TransporterItem"("status");

-- CreateIndex
CREATE INDEX "TransporterItem_paymentStatus_idx" ON "TransporterItem"("paymentStatus");

-- CreateIndex
CREATE INDEX "TransporterPayment_transportItemId_idx" ON "TransporterPayment"("transportItemId");

-- CreateIndex
CREATE INDEX "TransporterPayment_paymentDate_idx" ON "TransporterPayment"("paymentDate");

-- AddForeignKey
ALTER TABLE "TransporterItemColumnLock" ADD CONSTRAINT "TransporterItemColumnLock_lockedById_fkey" FOREIGN KEY ("lockedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transporter" ADD CONSTRAINT "Transporter_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transporter" ADD CONSTRAINT "Transporter_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransporterItem" ADD CONSTRAINT "TransporterItem_transporterId_fkey" FOREIGN KEY ("transporterId") REFERENCES "Transporter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransporterPayment" ADD CONSTRAINT "TransporterPayment_transportItemId_fkey" FOREIGN KEY ("transportItemId") REFERENCES "TransporterItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransporterPayment" ADD CONSTRAINT "TransporterPayment_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
