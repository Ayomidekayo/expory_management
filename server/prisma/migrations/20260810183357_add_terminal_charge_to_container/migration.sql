-- CreateEnum
CREATE TYPE "TerminalChargeStatus" AS ENUM ('UNPAID', 'PAID', 'WAIVED');

-- AlterEnum
ALTER TYPE "DocumentType" ADD VALUE 'TERMINAL_PAYMENT_RECEIPT';

-- AlterEnum
ALTER TYPE "InvoiceStatus" ADD VALUE 'UNPAID';

-- AlterTable
ALTER TABLE "Container" ADD COLUMN     "terminalChargeAmount" DECIMAL(18,2),
ADD COLUMN     "terminalChargeCurrency" "Currency",
ADD COLUMN     "terminalChargePaidAt" TIMESTAMP(3),
ADD COLUMN     "terminalChargeStatus" "TerminalChargeStatus" NOT NULL DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "externalInvoiceNumber" TEXT,
ALTER COLUMN "status" SET DEFAULT 'UNPAID';
