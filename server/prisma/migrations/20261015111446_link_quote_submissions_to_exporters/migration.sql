-- AlterTable
ALTER TABLE "QuoteItem" ADD COLUMN     "exporterId" TEXT;

-- AlterTable
ALTER TABLE "QuoteSubmission" ADD COLUMN     "exporterId" TEXT;

-- AddForeignKey
ALTER TABLE "QuoteSubmission" ADD CONSTRAINT "QuoteSubmission_exporterId_fkey" FOREIGN KEY ("exporterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
