"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadPath = path_1.default.join(process.cwd(), "uploads", "allocations");
if (!fs_1.default.existsSync(uploadPath)) {
    fs_1.default.mkdirSync(uploadPath, {
        recursive: true,
    });
}
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadPath);
    },
    filename(req, file, cb) {
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}${ext}`);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
});
