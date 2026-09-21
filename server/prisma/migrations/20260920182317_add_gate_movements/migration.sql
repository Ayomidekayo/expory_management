-- CreateEnum
CREATE TYPE "GateType" AS ENUM ('TERMINAL_GATE', 'EKO_WISE_GATE');

-- CreateEnum
CREATE TYPE "GateMovementStatus" AS ENUM ('PENDING', 'CLEARED', 'CROSSED', 'CANCELLED');

-- CreateTable
CREATE TABLE "GateMovement" (
    "id" TEXT NOT NULL,
    "containerId" TEXT,
    "containerNumber" TEXT NOT NULL,
    "yardStoreNumber" TEXT,
    "truckFrontPlate" TEXT NOT NULL,
    "truckBackPlate" TEXT NOT NULL,
    "gateType" "GateType" NOT NULL,
    "status" "GateMovementStatus" NOT NULL DEFAULT 'PENDING',
    "crossedAt" TIMESTAMP(3),
    "clearedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GateMovement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GateMovement_containerId_idx" ON "GateMovement"("containerId");

-- CreateIndex
CREATE INDEX "GateMovement_containerNumber_idx" ON "GateMovement"("containerNumber");

-- CreateIndex
CREATE INDEX "GateMovement_gateType_idx" ON "GateMovement"("gateType");

-- CreateIndex
CREATE INDEX "GateMovement_status_idx" ON "GateMovement"("status");

-- CreateIndex
CREATE INDEX "GateMovement_createdAt_idx" ON "GateMovement"("createdAt");

-- AddForeignKey
ALTER TABLE "GateMovement" ADD CONSTRAINT "GateMovement_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE SET NULL ON UPDATE CASCADE;
