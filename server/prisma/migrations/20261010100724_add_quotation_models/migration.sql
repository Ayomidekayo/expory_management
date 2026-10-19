-- CreateEnum
CREATE TYPE "QuoteMode" AS ENUM ('AIR', 'LAND', 'SEA');

-- CreateEnum
CREATE TYPE "QuoteDirection" AS ENUM ('IMPORT', 'EXPORT');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('CALCULATED', 'PENDING_REVIEW', 'APPROVED', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RateCardStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RateCalculationType" AS ENUM ('FIXED', 'WEIGHT_SLAB', 'PERCENTAGE', 'PER_UNIT', 'VARIABLE');

-- CreateEnum
CREATE TYPE "CalculationBasis" AS ENUM ('SUBTOTAL', 'CUSTOMS_VALUE', 'FREIGHT_AMOUNT');

-- CreateEnum
CREATE TYPE "QuoteSource" AS ENUM ('GUEST', 'ACCOUNT');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Permission" ADD VALUE 'VIEW_RATE_CARDS';
ALTER TYPE "Permission" ADD VALUE 'MANAGE_RATE_CARDS';
ALTER TYPE "Permission" ADD VALUE 'ACTIVATE_RATE_CARDS';
ALTER TYPE "Permission" ADD VALUE 'MANAGE_QUOTE_SETTINGS';
ALTER TYPE "Permission" ADD VALUE 'VIEW_ALL_QUOTES';
ALTER TYPE "Permission" ADD VALUE 'REVIEW_QUOTE';
ALTER TYPE "Permission" ADD VALUE 'APPROVE_QUOTE';

-- CreateTable
CREATE TABLE "RateCard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mode" "QuoteMode" NOT NULL,
    "direction" "QuoteDirection" NOT NULL,
    "status" "RateCardStatus" NOT NULL DEFAULT 'DRAFT',
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateComponent" (
    "id" TEXT NOT NULL,
    "rateCardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "calculationType" "RateCalculationType" NOT NULL,
    "calculationBasis" "CalculationBasis",
    "unit" TEXT,
    "value" DECIMAL(18,2),
    "percentage" DECIMAL(18,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateCardNote" (
    "id" TEXT NOT NULL,
    "rateCardId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateCardNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "rateCardId" TEXT NOT NULL,
    "quoteNumber" TEXT NOT NULL,
    "status" "QuoteStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "source" "QuoteSource" NOT NULL DEFAULT 'GUEST',
    "customerName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "totalAmount" DECIMAL(18,2),
    "validUntil" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeightSlab" (
    "id" TEXT NOT NULL,
    "rateCardId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "minWeightKg" DECIMAL(12,3) NOT NULL,
    "maxWeightKg" DECIMAL(12,3),
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeightSlab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeightSlabRate" (
    "id" TEXT NOT NULL,
    "weightSlabId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeightSlabRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RateCard_mode_direction_status_idx" ON "RateCard"("mode", "direction", "status");

-- CreateIndex
CREATE INDEX "RateCard_effectiveFrom_effectiveTo_idx" ON "RateCard"("effectiveFrom", "effectiveTo");

-- CreateIndex
CREATE INDEX "RateCard_createdById_idx" ON "RateCard"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "RateCard_name_mode_direction_effectiveFrom_key" ON "RateCard"("name", "mode", "direction", "effectiveFrom");

-- CreateIndex
CREATE INDEX "RateComponent_rateCardId_idx" ON "RateComponent"("rateCardId");

-- CreateIndex
CREATE INDEX "RateCardNote_rateCardId_idx" ON "RateCardNote"("rateCardId");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_quoteNumber_key" ON "Quote"("quoteNumber");

-- CreateIndex
CREATE INDEX "Quote_rateCardId_idx" ON "Quote"("rateCardId");

-- CreateIndex
CREATE INDEX "Quote_status_idx" ON "Quote"("status");

-- CreateIndex
CREATE INDEX "WeightSlab_rateCardId_minWeightKg_idx" ON "WeightSlab"("rateCardId", "minWeightKg");

-- CreateIndex
CREATE INDEX "WeightSlabRate_componentId_idx" ON "WeightSlabRate"("componentId");

-- CreateIndex
CREATE UNIQUE INDEX "WeightSlabRate_weightSlabId_componentId_key" ON "WeightSlabRate"("weightSlabId", "componentId");

-- AddForeignKey
ALTER TABLE "RateCard" ADD CONSTRAINT "RateCard_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateComponent" ADD CONSTRAINT "RateComponent_rateCardId_fkey" FOREIGN KEY ("rateCardId") REFERENCES "RateCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateCardNote" ADD CONSTRAINT "RateCardNote_rateCardId_fkey" FOREIGN KEY ("rateCardId") REFERENCES "RateCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_rateCardId_fkey" FOREIGN KEY ("rateCardId") REFERENCES "RateCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeightSlab" ADD CONSTRAINT "WeightSlab_rateCardId_fkey" FOREIGN KEY ("rateCardId") REFERENCES "RateCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeightSlabRate" ADD CONSTRAINT "WeightSlabRate_weightSlabId_fkey" FOREIGN KEY ("weightSlabId") REFERENCES "WeightSlab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeightSlabRate" ADD CONSTRAINT "WeightSlabRate_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "RateComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
