"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoice_controller_1 = __importDefault(require("../controllers/invoice.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const authorize_middleware_1 = __importDefault(require("../middleware/authorize.middleware"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.default);
/*
=====================================
Invoices
=====================================
*/
router.get("/", invoice_controller_1.default.findAll);
router.get("/:id", invoice_controller_1.default.findOne);
router.post("/", (0, authorize_middleware_1.default)("ADMIN", "STAFF", "OFFICER"), invoice_controller_1.default.create);
router.patch("/:id", (0, authorize_middleware_1.default)("ADMIN", "STAFF", "OFFICER"), invoice_controller_1.default.update);
router.delete("/:id", (0, authorize_middleware_1.default)("ADMIN"), invoice_controller_1.default.delete);
exports.default = router;
