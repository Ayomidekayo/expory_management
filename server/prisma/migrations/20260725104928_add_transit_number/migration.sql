/*
  Warnings:

  - A unique constraint covering the columns `[transitNumber]` on the table `Transit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transitNumber` to the `Transit` table without a default value. This is not possible if the table is not empty.
  - Made the column `containerId` on table `Transit` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Transit" DROP CONSTRAINT "Transit_containerId_fkey";

-- AlterTable
ALTER TABLE "Transit" ADD COLUMN     "transitNumber" TEXT NOT NULL,
ALTER COLUMN "containerId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transit_transitNumber_key" ON "Transit"("transitNumber");

-- AddForeignKey
ALTER TABLE "Transit" ADD CONSTRAINT "Transit_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
