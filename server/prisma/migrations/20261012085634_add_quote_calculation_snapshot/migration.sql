/*
  Warnings:

  - You are about to alter the column `quantity` on the `Quote` table. The data in that column could be lost. The data in that column will be cast from `Decimal(18,3)` to `Decimal(12,3)`.
  - You are about to drop the column `updatedAt` on the `QuoteItem` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `QuoteItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(18,3)` to `Decimal(12,3)`.
  - Made the column `quantity` on table `QuoteItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lineTotal` on table `QuoteItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "subtotal" DECIMAL(18,2),
ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(12,3);

-- AlterTable
ALTER TABLE "QuoteItem" DROP COLUMN "updatedAt",
ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(12,3),
ALTER COLUMN "lineTotal" SET NOT NULL;
