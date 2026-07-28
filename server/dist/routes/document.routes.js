"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const document_controller_1 = __importDefault(require("../controllers/document.controller"));
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
/*
=====================================
Upload
=====================================
*/
router.post("/", upload_1.upload.single("file"), document_controller_1.default.create);
/*
=====================================
Find All
=====================================
*/
router.get("/", document_controller_1.default.findAll);
/*
=====================================
Find By Id
=====================================
*/
router.get("/:id", document_controller_1.default.findById);
/*
=====================================
Update
=====================================
*/
router.patch("/:id", document_controller_1.default.update);
/*
=====================================
Delete
=====================================
*/
router.delete("/:id", document_controller_1.default.delete);
exports.default = router;
