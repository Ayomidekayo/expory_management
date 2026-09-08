-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "consigneeId" TEXT,
ADD COLUMN     "exporterId" TEXT;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_exporterId_fkey" FOREIGN KEY ("exporterId") REFERENCES "Exporter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_consigneeId_fkey" FOREIGN KEY ("consigneeId") REFERENCES "Consignee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
