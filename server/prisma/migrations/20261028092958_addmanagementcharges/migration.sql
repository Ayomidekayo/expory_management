-- CreateEnum
CREATE TYPE "QuoteSubmissionItemType" AS ENUM ('SERVICE', 'CUSTOMS_CHARGE', 'TRANSPORT_CHARGE');

-- AlterEnum
ALTER TYPE "QuoteAuditAction" ADD VALUE 'CHARGES_UPDATED';

-- AlterTable
ALTER TABLE "QuoteSubmission" ADD COLUMN     "customsChargeRequested" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "invoiceCurrency" TEXT,
ADD COLUMN     "invoiceValue" DECIMAL(18,2),
ADD COLUMN     "transportChargeRequested" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vatEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vatPercentage" DECIMAL(7,4) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "QuoteSubmissionItem" ADD COLUMN     "itemType" "QuoteSubmissionItemType" NOT NULL DEFAULT 'SERVICE';
