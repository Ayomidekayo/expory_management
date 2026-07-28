"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const exporter_controller_1 = __importDefault(require("../controllers/exporter.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.default);
router.get("/", exporter_controller_1.default.findAll);
router.get("/:id", exporter_controller_1.default.findById);
router.post("/", exporter_controller_1.default.create);
router.patch("/:id", exporter_controller_1.default.update);
router.delete("/:id", exporter_controller_1.default.delete);
exports.default = router;
