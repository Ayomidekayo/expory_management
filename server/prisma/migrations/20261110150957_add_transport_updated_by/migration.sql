-- AlterTable
ALTER TABLE "Transport" ADD COLUMN     "updatedById" TEXT;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
