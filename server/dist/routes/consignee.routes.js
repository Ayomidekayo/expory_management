"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const consignee_controller_1 = __importDefault(require("../controllers/consignee.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.default);
router.post("/", consignee_controller_1.default.create);
router.get("/", consignee_controller_1.default.findAll);
router.get("/:id", consignee_controller_1.default.findOne);
router.patch("/:id", consignee_controller_1.default.update);
router.delete("/:id", consignee_controller_1.default.delete);
exports.default = router;
