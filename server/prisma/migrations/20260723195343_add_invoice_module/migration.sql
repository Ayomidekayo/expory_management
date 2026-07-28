/*
  Warnings:

  - You are about to drop the column `numberOfTrucks` on the `Invoice` table. All the data in the column will be lost.
  - The `paymentTerms` column on the `Invoice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `subtotal` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `currency` on the `Invoice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('NGN', 'USD', 'EUR');

-- CreateEnum
CREATE TYPE "PaymentTerms" AS ENUM ('CASH', 'ADVANCE', 'COD', 'NET_15', 'NET_30', 'NET_60', 'LETTER_OF_CREDIT');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'APPROVED', 'PAID', 'CANCELLED');

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "numberOfTrucks",
ADD COLUMN     "exchangeRate" DECIMAL(18,4),
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "subtotal" DECIMAL(18,2) NOT NULL,
ADD COLUMN     "transportUnits" INTEGER,
DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" NOT NULL,
DROP COLUMN "paymentTerms",
ADD COLUMN     "paymentTerms" "PaymentTerms";

-- AlterTable
ALTER TABLE "InvoiceItem" ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "unit" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Invoice_invoiceDate_idx" ON "Invoice"("invoiceDate");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE INDEX "Invoice_currency_idx" ON "Invoice"("currency");

-- CreateIndex
CREATE INDEX "InvoiceItem_invoiceId_idx" ON "InvoiceItem"("invoiceId");

-- CreateIndex
CREATE INDEX "InvoiceItem_hsCode_idx" ON "InvoiceItem"("hsCode");
