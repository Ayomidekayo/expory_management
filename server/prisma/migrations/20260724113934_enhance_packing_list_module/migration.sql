/*
  Warnings:

  - Added the required column `packingDate` to the `PackingList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PackingList" ADD COLUMN     "packingDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "remarks" TEXT;

-- CreateTable
CREATE TABLE "PackingListItem" (
    "id" TEXT NOT NULL,
    "packingListId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "packageType" TEXT,
    "packages" INTEGER,
    "grossWeight" DECIMAL(18,2),
    "netWeight" DECIMAL(18,2),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackingListItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PackingListItem" ADD CONSTRAINT "PackingListItem_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES "PackingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
