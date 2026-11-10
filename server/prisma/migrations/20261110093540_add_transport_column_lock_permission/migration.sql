-- AlterEnum
ALTER TYPE "Permission" ADD VALUE 'LOCK_TRANSPORT_COLUMNS';

-- AlterTable
ALTER TABLE "TransitInPayment" ADD COLUMN     "recordedById" TEXT;

-- AlterTable
ALTER TABLE "TransitOutPayment" ADD COLUMN     "recordedById" TEXT;

-- AlterTable
ALTER TABLE "TransportPayment" ADD COLUMN     "recordedById" TEXT;

-- CreateTable
CREATE TABLE "TransportItemColumnLock" (
    "id" TEXT NOT NULL,
    "columnKey" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "lockedById" TEXT,
    "lockReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransportItemColumnLock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransitInItemColumnLock" (
    "id" TEXT NOT NULL,
    "columnKey" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "lockedById" TEXT,
    "lockReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransitInItemColumnLock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransitOutItemColumnLock" (
    "id" TEXT NOT NULL,
    "columnKey" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "lockedById" TEXT,
    "lockReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransitOutItemColumnLock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransportItemColumnLock_columnKey_key" ON "TransportItemColumnLock"("columnKey");

-- CreateIndex
CREATE INDEX "TransportItemColumnLock_isLocked_idx" ON "TransportItemColumnLock"("isLocked");

-- CreateIndex
CREATE INDEX "TransportItemColumnLock_lockedById_idx" ON "TransportItemColumnLock"("lockedById");

-- CreateIndex
CREATE UNIQUE INDEX "TransitInItemColumnLock_columnKey_key" ON "TransitInItemColumnLock"("columnKey");

-- CreateIndex
CREATE INDEX "TransitInItemColumnLock_isLocked_idx" ON "TransitInItemColumnLock"("isLocked");

-- CreateIndex
CREATE INDEX "TransitInItemColumnLock_lockedById_idx" ON "TransitInItemColumnLock"("lockedById");

-- CreateIndex
CREATE UNIQUE INDEX "TransitOutItemColumnLock_columnKey_key" ON "TransitOutItemColumnLock"("columnKey");

-- CreateIndex
CREATE INDEX "TransitOutItemColumnLock_isLocked_idx" ON "TransitOutItemColumnLock"("isLocked");

-- CreateIndex
CREATE INDEX "TransitOutItemColumnLock_lockedById_idx" ON "TransitOutItemColumnLock"("lockedById");

-- AddForeignKey
ALTER TABLE "TransportPayment" ADD CONSTRAINT "TransportPayment_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitInPayment" ADD CONSTRAINT "TransitInPayment_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitOutPayment" ADD CONSTRAINT "TransitOutPayment_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportItemColumnLock" ADD CONSTRAINT "TransportItemColumnLock_lockedById_fkey" FOREIGN KEY ("lockedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitInItemColumnLock" ADD CONSTRAINT "TransitInItemColumnLock_lockedById_fkey" FOREIGN KEY ("lockedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitOutItemColumnLock" ADD CONSTRAINT "TransitOutItemColumnLock_lockedById_fkey" FOREIGN KEY ("lockedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
