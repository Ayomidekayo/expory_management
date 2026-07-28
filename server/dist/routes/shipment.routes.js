"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shipment_controller_1 = __importDefault(require("../controllers/shipment.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const authorize_middleware_1 = __importDefault(require("../middleware/authorize.middleware"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.default);
/*
=====================================
Get All
=====================================
*/
router.get("/available", shipment_controller_1.default.findAvailable);
router.get("/", shipment_controller_1.default.findAll);
/*
=====================================
Get One
=====================================
*/
router.get("/:id", shipment_controller_1.default.findOne);
/*
=====================================
Create
=====================================
*/
router.post("/", (0, authorize_middleware_1.default)("ADMIN", "STAFF", "OFFICER"), shipment_controller_1.default.create);
/*
=====================================
Update
=====================================
*/
router.patch("/:id", (0, authorize_middleware_1.default)("ADMIN", "STAFF", "OFFICER"), shipment_controller_1.default.update);
/*
=====================================
Delete
=====================================
*/
router.delete("/:id", (0, authorize_middleware_1.default)("ADMIN"), shipment_controller_1.default.delete);
exports.default = router;
