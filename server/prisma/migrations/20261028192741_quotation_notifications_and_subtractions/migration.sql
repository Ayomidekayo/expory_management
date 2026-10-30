-- AlterEnum
ALTER TYPE "QuoteSubmissionItemType" ADD VALUE 'SUBTRACTION';

-- AlterTable
ALTER TABLE "QuoteNotification" ADD COLUMN     "submissionId" TEXT;
