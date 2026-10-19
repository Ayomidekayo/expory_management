-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_rateCardId_fkey";

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "customsValue" DECIMAL(18,2),
ADD COLUMN     "freightAmount" DECIMAL(18,2),
ADD COLUMN     "goodsDescription" TEXT,
ADD COLUMN     "hsCode" TEXT,
ADD COLUMN     "inputSnapshot" JSONB,
ADD COLUMN     "pricingSnapshot" JSONB,
ADD COLUMN     "quantity" DECIMAL(18,3),
ADD COLUMN     "requiresReview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "weightKg" DECIMAL(12,3);

-- CreateTable
CREATE TABLE "QuoteItem" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "componentId" TEXT,
    "componentName" TEXT NOT NULL,
    "componentCode" TEXT,
    "calculationType" "RateCalculationType" NOT NULL,
    "calculationBasis" "CalculationBasis",
    "unit" TEXT,
    "rateApplied" DECIMAL(18,4),
    "quantity" DECIMAL(18,3),
    "lineTotal" DECIMAL(18,2),
    "isEstimate" BOOLEAN NOT NULL DEFAULT false,
    "requiresReview" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuoteItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuoteItem_quoteId_idx" ON "QuoteItem"("quoteId");

-- CreateIndex
CREATE INDEX "QuoteItem_componentId_idx" ON "QuoteItem"("componentId");

-- CreateIndex
CREATE INDEX "Quote_email_idx" ON "Quote"("email");

-- CreateIndex
CREATE INDEX "Quote_createdAt_idx" ON "Quote"("createdAt");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_rateCardId_fkey" FOREIGN KEY ("rateCardId") REFERENCES "RateCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
