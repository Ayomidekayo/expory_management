-- DropForeignKey
ALTER TABLE "TransporterPayment" DROP CONSTRAINT "TransporterPayment_transportItemId_fkey";

-- AddForeignKey
ALTER TABLE "TransporterPayment" ADD CONSTRAINT "TransporterPayment_transportItemId_fkey" FOREIGN KEY ("transportItemId") REFERENCES "TransporterItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
