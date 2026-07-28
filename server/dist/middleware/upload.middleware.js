"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/*
=====================================
Upload Directory
=====================================
*/
const uploadPath = path_1.default.join(process.cwd(), "uploads", "documents");
/*
=====================================
Create Folder if it doesn't exist
=====================================
*/
if (!fs_1.default.existsSync(uploadPath)) {
    fs_1.default.mkdirSync(uploadPath, {
        recursive: true,
    });
}
/*
=====================================
Storage
=====================================
*/
const storage = multer_1.default.diskStorage({
    destination(_req, _file, cb) {
        cb(null, uploadPath);
    },
    filename(_req, file, cb) {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
/*
=====================================
Allowed File Types
=====================================
*/
const fileFilter = (_req, file, cb) => {
    const allowedMimeTypes = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/jpg",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        return cb(null, true);
    }
    cb(new Error("Only PDF, PNG and JPG files are allowed."));
};
/*
=====================================
Upload Middleware
=====================================
*/
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});
exports.default = upload;
