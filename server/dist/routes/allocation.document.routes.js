"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const allocation_document_controller_1 = __importDefault(require("../controllers/allocation.document.controller"));
const upload_middleware_1 = __importDefault(require("../middleware/upload.middleware"));
const router = (0, express_1.Router)();
/*
=========================================
All Allocation Routes Require Login
=========================================
*/
router.use(auth_middleware_1.default);
router.post("/:id/documents", upload_middleware_1.default.single("file"), allocation_document_controller_1.default.create);
router.get("/:id/documents", allocation_document_controller_1.default.findAll);
router.delete("/documents/:documentId", allocation_document_controller_1.default.delete);
exports.default = router;
