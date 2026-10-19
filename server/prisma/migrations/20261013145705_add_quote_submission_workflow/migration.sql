/*
  Warnings:

  - Made the column `rateApplied` on table `QuoteItem` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "QuoteSubmissionStatus" AS ENUM ('PENDING_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "QuoteMessageSenderType" AS ENUM ('EXPORTER', 'ADMIN');

-- CreateEnum
CREATE TYPE "QuoteAuditAction" AS ENUM ('SUBMITTED', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED', 'WORK_STARTED', 'COMPLETED', 'ARCHIVED', 'REOPENED');

-- AlterEnum
ALTER TYPE "Currency" ADD VALUE 'CFA';

-- AlterTable
ALTER TABLE "QuoteItem" ALTER COLUMN "rateApplied" SET NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "QuoteSubmission" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "customerName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "status" "QuoteSubmissionStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "subtotal" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "customerMessage" TEXT,
    "adminMessage" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuoteSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteSubmissionItem" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "quoteItemId" TEXT,
    "componentName" TEXT NOT NULL,
    "componentCode" TEXT,
    "quantity" DECIMAL(12,3) NOT NULL DEFAULT 1,
    "rateApplied" DECIMAL(18,4) NOT NULL,
    "lineTotal" DECIMAL(18,2) NOT NULL,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteSubmissionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteMessage" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "submissionId" TEXT,
    "senderType" "QuoteMessageSenderType" NOT NULL,
    "senderUserId" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteAttachment" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "submissionId" TEXT,
    "messageId" TEXT,
    "uploadedById" TEXT,
    "uploadedByType" "QuoteMessageSenderType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT,
    "fileUrl" TEXT NOT NULL,
    "publicId" TEXT,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteNotification" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "recipientUserId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteAuditEvent" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "submissionId" TEXT,
    "action" "QuoteAuditAction" NOT NULL,
    "actorUserId" TEXT,
    "actorType" "QuoteMessageSenderType" NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuoteSubmission_quoteId_createdAt_idx" ON "QuoteSubmission"("quoteId", "createdAt");

-- CreateIndex
CREATE INDEX "QuoteSubmission_status_createdAt_idx" ON "QuoteSubmission"("status", "createdAt");

-- CreateIndex
CREATE INDEX "QuoteSubmission_email_idx" ON "QuoteSubmission"("email");

-- CreateIndex
CREATE INDEX "QuoteSubmissionItem_submissionId_idx" ON "QuoteSubmissionItem"("submissionId");

-- CreateIndex
CREATE INDEX "QuoteSubmissionItem_quoteItemId_idx" ON "QuoteSubmissionItem"("quoteItemId");

-- CreateIndex
CREATE INDEX "QuoteMessage_quoteId_createdAt_idx" ON "QuoteMessage"("quoteId", "createdAt");

-- CreateIndex
CREATE INDEX "QuoteMessage_submissionId_createdAt_idx" ON "QuoteMessage"("submissionId", "createdAt");

-- CreateIndex
CREATE INDEX "QuoteAttachment_quoteId_createdAt_idx" ON "QuoteAttachment"("quoteId", "createdAt");

-- CreateIndex
CREATE INDEX "QuoteAttachment_submissionId_idx" ON "QuoteAttachment"("submissionId");

-- CreateIndex
CREATE INDEX "QuoteAttachment_messageId_idx" ON "QuoteAttachment"("messageId");

-- CreateIndex
CREATE INDEX "QuoteNotification_recipientUserId_isRead_createdAt_idx" ON "QuoteNotification"("recipientUserId", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "QuoteNotification_quoteId_createdAt_idx" ON "QuoteNotification"("quoteId", "createdAt");

-- CreateIndex
CREATE INDEX "QuoteAuditEvent_quoteId_createdAt_idx" ON "QuoteAuditEvent"("quoteId", "createdAt");

-- CreateIndex
CREATE INDEX "QuoteAuditEvent_submissionId_createdAt_idx" ON "QuoteAuditEvent"("submissionId", "createdAt");

-- AddForeignKey
ALTER TABLE "QuoteSubmission" ADD CONSTRAINT "QuoteSubmission_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteSubmissionItem" ADD CONSTRAINT "QuoteSubmissionItem_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "QuoteSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteSubmissionItem" ADD CONSTRAINT "QuoteSubmissionItem_quoteItemId_fkey" FOREIGN KEY ("quoteItemId") REFERENCES "QuoteItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteMessage" ADD CONSTRAINT "QuoteMessage_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteMessage" ADD CONSTRAINT "QuoteMessage_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "QuoteSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteMessage" ADD CONSTRAINT "QuoteMessage_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteAttachment" ADD CONSTRAINT "QuoteAttachment_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteAttachment" ADD CONSTRAINT "QuoteAttachment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "QuoteSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteAttachment" ADD CONSTRAINT "QuoteAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "QuoteMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteAttachment" ADD CONSTRAINT "QuoteAttachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteNotification" ADD CONSTRAINT "QuoteNotification_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteNotification" ADD CONSTRAINT "QuoteNotification_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteAuditEvent" ADD CONSTRAINT "QuoteAuditEvent_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteAuditEvent" ADD CONSTRAINT "QuoteAuditEvent_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "QuoteSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteAuditEvent" ADD CONSTRAINT "QuoteAuditEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
