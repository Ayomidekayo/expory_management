/*
  Warnings:

  - The values [EKO_WISE_GATE] on the enum `GateType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GateType_new" AS ENUM ('TERMINAL_GATE', 'ECOWAS_GATE');
ALTER TABLE "GateMovement" ALTER COLUMN "gateType" TYPE "GateType_new" USING ("gateType"::text::"GateType_new");
ALTER TYPE "GateType" RENAME TO "GateType_old";
ALTER TYPE "GateType_new" RENAME TO "GateType";
DROP TYPE "public"."GateType_old";
COMMIT;
