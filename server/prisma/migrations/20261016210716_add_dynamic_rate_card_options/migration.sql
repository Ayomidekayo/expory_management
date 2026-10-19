-- AlterTable
ALTER TABLE "RateCardConfiguration" ADD COLUMN     "customsValueEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "freightAmountEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quantityEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vatCalculationBasis" "CalculationBasis",
ADD COLUMN     "weightEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "RateComponent" ADD COLUMN     "optionId" TEXT,
ADD COLUMN     "pricingSectionId" TEXT;

-- AlterTable
ALTER TABLE "WeightSlab" ADD COLUMN     "optionId" TEXT,
ADD COLUMN     "pricingSectionId" TEXT;

-- CreateTable
CREATE TABLE "RateCardOption" (
    "id" TEXT NOT NULL,
    "configurationId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateCardOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateCardPricingSection" (
    "id" TEXT NOT NULL,
    "configurationId" TEXT NOT NULL,
    "optionId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateCardPricingSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RateCardOption_configurationId_isActive_displayOrder_idx" ON "RateCardOption"("configurationId", "isActive", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "RateCardOption_configurationId_code_key" ON "RateCardOption"("configurationId", "code");

-- CreateIndex
CREATE INDEX "RateCardPricingSection_configurationId_isActive_displayOrde_idx" ON "RateCardPricingSection"("configurationId", "isActive", "displayOrder");

-- CreateIndex
CREATE INDEX "RateCardPricingSection_optionId_idx" ON "RateCardPricingSection"("optionId");

-- CreateIndex
CREATE UNIQUE INDEX "RateCardPricingSection_configurationId_code_key" ON "RateCardPricingSection"("configurationId", "code");

-- CreateIndex
CREATE INDEX "RateComponent_optionId_idx" ON "RateComponent"("optionId");

-- CreateIndex
CREATE INDEX "RateComponent_pricingSectionId_idx" ON "RateComponent"("pricingSectionId");

-- CreateIndex
CREATE INDEX "WeightSlab_optionId_minWeightKg_idx" ON "WeightSlab"("optionId", "minWeightKg");

-- CreateIndex
CREATE INDEX "WeightSlab_pricingSectionId_minWeightKg_idx" ON "WeightSlab"("pricingSectionId", "minWeightKg");

-- AddForeignKey
ALTER TABLE "RateComponent" ADD CONSTRAINT "RateComponent_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "RateCardOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateComponent" ADD CONSTRAINT "RateComponent_pricingSectionId_fkey" FOREIGN KEY ("pricingSectionId") REFERENCES "RateCardPricingSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeightSlab" ADD CONSTRAINT "WeightSlab_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "RateCardOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeightSlab" ADD CONSTRAINT "WeightSlab_pricingSectionId_fkey" FOREIGN KEY ("pricingSectionId") REFERENCES "RateCardPricingSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateCardOption" ADD CONSTRAINT "RateCardOption_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "RateCardConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateCardPricingSection" ADD CONSTRAINT "RateCardPricingSection_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "RateCardConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateCardPricingSection" ADD CONSTRAINT "RateCardPricingSection_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "RateCardOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;
