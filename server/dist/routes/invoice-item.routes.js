"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const authorize_middleware_1 = __importDefault(require("../middleware/authorize.middleware"));
const invoice_item_controller_1 = __importDefault(require("../controllers/invoice-item.controller"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.default);
router.post("/", (0, authorize_middleware_1.default)("ADMIN", "STAFF"), invoice_item_controller_1.default.create);
router.get("/invoice/:invoiceId", invoice_item_controller_1.default.findByInvoice);
router.get("/:id", invoice_item_controller_1.default.findOne);
router.patch("/:id", (0, authorize_middleware_1.default)("ADMIN", "STAFF"), invoice_item_controller_1.default.update);
router.delete("/:id", (0, authorize_middleware_1.default)("ADMIN", "STAFF"), invoice_item_controller_1.default.delete);
exports.default = router;
