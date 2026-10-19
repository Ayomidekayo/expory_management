-- AlterTable
ALTER TABLE "QuoteItem" ADD COLUMN     "segmentId" TEXT;

-- AlterTable
ALTER TABLE "RateComponent" ADD COLUMN     "configurationId" TEXT,
ADD COLUMN     "isOptional" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTaxable" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WeightSlab" ADD COLUMN     "configurationId" TEXT;

-- CreateTable
CREATE TABLE "RateCardConfiguration" (
    "id" TEXT NOT NULL,
    "rateCardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "routeCode" TEXT,
    "routeLabel" TEXT,
    "equipmentType" TEXT,
    "airlineSelectorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "transportEnabled" BOOLEAN NOT NULL DEFAULT false,
    "nafdacEnabled" BOOLEAN NOT NULL DEFAULT false,
    "vatEnabled" BOOLEAN NOT NULL DEFAULT false,
    "vatPercentage" DECIMAL(5,2) NOT NULL DEFAULT 7.5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateCardConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateCardAirline" (
    "id" TEXT NOT NULL,
    "configurationId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ratePerKg" DECIMAL(18,4) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateCardAirline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteSegment" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "configurationId" TEXT,
    "name" TEXT NOT NULL,
    "routeCode" TEXT,
    "currency" TEXT NOT NULL,
    "subtotal" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteSegment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RateCardConfiguration_rateCardId_isActive_idx" ON "RateCardConfiguration"("rateCardId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "RateCardConfiguration_rateCardId_code_key" ON "RateCardConfiguration"("rateCardId", "code");

-- CreateIndex
CREATE INDEX "RateCardAirline_configurationId_isActive_idx" ON "RateCardAirline"("configurationId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "RateCardAirline_configurationId_code_key" ON "RateCardAirline"("configurationId", "code");

-- CreateIndex
CREATE INDEX "QuoteSegment_quoteId_idx" ON "QuoteSegment"("quoteId");

-- AddForeignKey
ALTER TABLE "RateComponent" ADD CONSTRAINT "RateComponent_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "RateCardConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeightSlab" ADD CONSTRAINT "WeightSlab_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "RateCardConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "QuoteSegment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateCardConfiguration" ADD CONSTRAINT "RateCardConfiguration_rateCardId_fkey" FOREIGN KEY ("rateCardId") REFERENCES "RateCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateCardAirline" ADD CONSTRAINT "RateCardAirline_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "RateCardConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteSegment" ADD CONSTRAINT "QuoteSegment_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteSegment" ADD CONSTRAINT "QuoteSegment_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "RateCardConfiguration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
