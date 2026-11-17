-- AlterTable
ALTER TABLE "TransitMovement" ADD COLUMN     "clientId" TEXT;

-- AddForeignKey
ALTER TABLE "TransitMovement" ADD CONSTRAINT "TransitMovement_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
