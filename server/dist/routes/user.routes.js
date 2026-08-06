"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
/*
=====================================
Profile
=====================================
*/
router.get("/profile", auth_middleware_1.default, user_controller_1.default.getProfile);
router.patch("/profile", auth_middleware_1.default, user_controller_1.default.updateProfile);
/*
=====================================
Password
=====================================
*/
router.patch("/change-password", auth_middleware_1.default, user_controller_1.default.changePassword);
exports.default = router;
