
import { prisma } from "../../config/prisma";
import {
  uploadToSupabase,
  deleteFromSupabase,
} from "../../services/supabase-storage.service";

type UploadQuotationAttachmentInput = {
  submissionId: string;
  userId: string;
  senderType: "EXPORTER" | "ADMIN";
  file: Express.Multer.File;
  remarks?: string;
};

async function upload(input: UploadQuotationAttachmentInput) {
  const {
    submissionId,
    userId,
    senderType,
    file,
    remarks,
  } = input;

  const submission = await prisma.quoteSubmission.findUnique({
    where: { id: submissionId },
    select: {
      id: true,
      quoteId: true,
      exporterId: true,
    },
  });

  if (!submission) {
    throw new Error("SUBMISSION_NOT_FOUND");
  }

  if (
    senderType === "EXPORTER" &&
    submission.exporterId !== userId
  ) {
    throw new Error("SUBMISSION_NOT_FOUND");
  }

  const uploaded = await uploadToSupabase(file);

  try {
    return await prisma.quoteAttachment.create({
      data: {
        quoteId: submission.quoteId,
        submissionId: submission.id,
        uploadedById: userId,
        uploadedByType: senderType,
        fileName: uploaded.publicId,
        originalName: file.originalname,
        fileUrl: uploaded.fileUrl,
        publicId: uploaded.publicId,
        mimeType: file.mimetype,
        fileSize: file.size,
        remarks: remarks?.trim() || null,
      },
    });
  } catch (error) {
    try {
      await deleteFromSupabase(uploaded.publicId);
    } catch (cleanupError) {
      console.error(
        "Failed to clean up quotation attachment:",
        cleanupError
      );
    }

    throw error;
  }
}

export default { upload };
