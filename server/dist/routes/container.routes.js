"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_controller_1 = __importDefault(require("../controllers/container.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const authorize_middleware_1 = __importDefault(require("../middleware/authorize.middleware"));
const router = (0, express_1.Router)();
/*
=====================================
Create
=====================================
*/
router.post("/", auth_middleware_1.default, (0, authorize_middleware_1.default)("ADMIN", "STAFF"), container_controller_1.default.create);
/*
=====================================
Find All
=====================================
*/
router.get("/", auth_middleware_1.default, (0, authorize_middleware_1.default)("ADMIN", "STAFF", "VIEWER"), container_controller_1.default.findAll);
/*
=====================================
Find One
=====================================
*/
router.get("/:id", auth_middleware_1.default, (0, authorize_middleware_1.default)("ADMIN", "STAFF", "VIEWER"), container_controller_1.default.findById);
/*
=====================================
Update
=====================================
*/
router.patch("/:id", auth_middleware_1.default, (0, authorize_middleware_1.default)("ADMIN", "STAFF"), container_controller_1.default.update);
/*
=====================================
Delete
=====================================
*/
router.delete("/:id", auth_middleware_1.default, (0, authorize_middleware_1.default)("ADMIN"), container_controller_1.default.delete);
exports.default = router;
