/*
  Warnings:

  - You are about to drop the `TransitIn` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransitInItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransitInItemColumnLock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransitInPayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransitOut` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransitOutItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransitOutItemColumnLock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransitOutPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TransitDirection" AS ENUM ('IN', 'OUT');

-- DropForeignKey
ALTER TABLE "TransitIn" DROP CONSTRAINT "TransitIn_shipmentId_fkey";

-- DropForeignKey
ALTER TABLE "TransitInItem" DROP CONSTRAINT "TransitInItem_transitInId_fkey";

-- DropForeignKey
ALTER TABLE "TransitInItemColumnLock" DROP CONSTRAINT "TransitInItemColumnLock_lockedById_fkey";

-- DropForeignKey
ALTER TABLE "TransitInPayment" DROP CONSTRAINT "TransitInPayment_recordedById_fkey";

-- DropForeignKey
ALTER TABLE "TransitInPayment" DROP CONSTRAINT "TransitInPayment_transitInItemId_fkey";

-- DropForeignKey
ALTER TABLE "TransitOut" DROP CONSTRAINT "TransitOut_shipmentId_fkey";

-- DropForeignKey
ALTER TABLE "TransitOutItem" DROP CONSTRAINT "TransitOutItem_transitOutId_fkey";

-- DropForeignKey
ALTER TABLE "TransitOutItemColumnLock" DROP CONSTRAINT "TransitOutItemColumnLock_lockedById_fkey";

-- DropForeignKey
ALTER TABLE "TransitOutPayment" DROP CONSTRAINT "TransitOutPayment_recordedById_fkey";

-- DropForeignKey
ALTER TABLE "TransitOutPayment" DROP CONSTRAINT "TransitOutPayment_transitOutItemId_fkey";

-- DropTable
DROP TABLE "TransitIn";

-- DropTable
DROP TABLE "TransitInItem";

-- DropTable
DROP TABLE "TransitInItemColumnLock";

-- DropTable
DROP TABLE "TransitInPayment";

-- DropTable
DROP TABLE "TransitOut";

-- DropTable
DROP TABLE "TransitOutItem";

-- DropTable
DROP TABLE "TransitOutItemColumnLock";

-- DropTable
DROP TABLE "TransitOutPayment";

-- CreateTable
CREATE TABLE "TransitMovement" (
    "id" TEXT NOT NULL,
    "transitNumber" TEXT NOT NULL,
    "transitDate" TIMESTAMP(3) NOT NULL,
    "direction" "TransitDirection" NOT NULL,
    "shipmentId" TEXT,
    "remarks" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransitMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransitMovementItem" (
    "id" TEXT NOT NULL,
    "transitMovementId" TEXT NOT NULL,
    "itemDate" TIMESTAMP(3) NOT NULL,
    "itemType" "TransportItemType" NOT NULL,
    "name" TEXT,
    "clientName" TEXT NOT NULL,
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

    CONSTRAINT "TransitMovementItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransitMovementPayment" (
    "id" TEXT NOT NULL,
    "transitMovementItemId" TEXT NOT NULL,
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

    CONSTRAINT "TransitMovementPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransitMovementItemColumnLock" (
    "id" TEXT NOT NULL,
    "columnKey" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "lockedById" TEXT,
    "lockReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransitMovementItemColumnLock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransitMovement_transitNumber_key" ON "TransitMovement"("transitNumber");

-- CreateIndex
CREATE INDEX "TransitMovement_shipmentId_idx" ON "TransitMovement"("shipmentId");

-- CreateIndex
CREATE INDEX "TransitMovement_transitDate_idx" ON "TransitMovement"("transitDate");

-- CreateIndex
CREATE INDEX "TransitMovement_direction_idx" ON "TransitMovement"("direction");

-- CreateIndex
CREATE INDEX "TransitMovement_createdAt_idx" ON "TransitMovement"("createdAt");

-- CreateIndex
CREATE INDEX "TransitMovementItem_transitMovementId_idx" ON "TransitMovementItem"("transitMovementId");

-- CreateIndex
CREATE INDEX "TransitMovementItem_itemDate_idx" ON "TransitMovementItem"("itemDate");

-- CreateIndex
CREATE INDEX "TransitMovementItem_itemType_idx" ON "TransitMovementItem"("itemType");

-- CreateIndex
CREATE INDEX "TransitMovementItem_paymentStatus_idx" ON "TransitMovementItem"("paymentStatus");

-- CreateIndex
CREATE INDEX "TransitMovementPayment_transitMovementItemId_idx" ON "TransitMovementPayment"("transitMovementItemId");

-- CreateIndex
CREATE INDEX "TransitMovementPayment_paymentDate_idx" ON "TransitMovementPayment"("paymentDate");

-- CreateIndex
CREATE UNIQUE INDEX "TransitMovementItemColumnLock_columnKey_key" ON "TransitMovementItemColumnLock"("columnKey");

-- CreateIndex
CREATE INDEX "TransitMovementItemColumnLock_isLocked_idx" ON "TransitMovementItemColumnLock"("isLocked");

-- CreateIndex
CREATE INDEX "TransitMovementItemColumnLock_lockedById_idx" ON "TransitMovementItemColumnLock"("lockedById");

-- AddForeignKey
ALTER TABLE "TransitMovement" ADD CONSTRAINT "TransitMovement_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitMovementItem" ADD CONSTRAINT "TransitMovementItem_transitMovementId_fkey" FOREIGN KEY ("transitMovementId") REFERENCES "TransitMovement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitMovementPayment" ADD CONSTRAINT "TransitMovementPayment_transitMovementItemId_fkey" FOREIGN KEY ("transitMovementItemId") REFERENCES "TransitMovementItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitMovementPayment" ADD CONSTRAINT "TransitMovementPayment_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitMovementItemColumnLock" ADD CONSTRAINT "TransitMovementItemColumnLock_lockedById_fkey" FOREIGN KEY ("lockedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
