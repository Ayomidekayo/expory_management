-- AlterEnum
ALTER TYPE "QuoteSubmissionItemType" ADD VALUE 'OTHER_CHARGE';

-- AlterTable
ALTER TABLE "QuoteSubmissionItem" ADD COLUMN     "reason" TEXT;
