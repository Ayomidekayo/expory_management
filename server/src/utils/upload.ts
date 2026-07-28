import { Express } from "express";

export function buildFileMetadata(
  file: Express.Multer.File
) {
  return {
    fileName: file.originalname,
    fileUrl: `/uploads/${file.filename}`,
    mimeType: file.mimetype,
    fileSize: file.size,
  };
}