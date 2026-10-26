-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Permission" ADD VALUE 'VIEW_OWN_QUOTES';
ALTER TYPE "Permission" ADD VALUE 'CREATE_QUOTE';
ALTER TYPE "Permission" ADD VALUE 'REQUEST_QUOTE_CHANGES';
ALTER TYPE "Permission" ADD VALUE 'REJECT_QUOTE';
ALTER TYPE "Permission" ADD VALUE 'MANAGE_QUOTE_ASSIGNMENTS';
ALTER TYPE "Permission" ADD VALUE 'UPLOAD_QUOTE_ATTACHMENT';
ALTER TYPE "Permission" ADD VALUE 'ADD_QUOTE_MESSAGE';
ALTER TYPE "Permission" ADD VALUE 'PRINT_QUOTE';
ALTER TYPE "Permission" ADD VALUE 'ACCEPT_QUOTE';
ALTER TYPE "Permission" ADD VALUE 'DECLINE_QUOTE';
ALTER TYPE "Permission" ADD VALUE 'COMPLETE_QUOTE';
