"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFileMetadata = buildFileMetadata;
function buildFileMetadata(file) {
    return {
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        mimeType: file.mimetype,
        fileSize: file.size,
    };
}
