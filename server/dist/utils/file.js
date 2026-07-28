"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = deleteFile;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
async function deleteFile(fileUrl) {
    if (!fileUrl)
        return;
    try {
        const filePath = path_1.default.join(process.cwd(), fileUrl.replace(/^\//, ""));
        await promises_1.default.unlink(filePath);
    }
    catch (error) {
        // Ignore if file doesn't exist
        if (error.code !== "ENOENT") {
            console.error("Failed to delete file:", error);
        }
    }
}
