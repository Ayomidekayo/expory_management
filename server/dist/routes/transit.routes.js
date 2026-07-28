"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transit_controller_1 = __importDefault(require("../controllers/transit.controller"));
const router = (0, express_1.Router)();
/*
=====================================
Create
=====================================
*/
router.post("/", transit_controller_1.default.create);
router.patch("/:id", transit_controller_1.default.update);
/*
=====================================
Find All
=====================================
*/
router.get("/", transit_controller_1.default.findAll);
/*
=====================================
Find By Id
=====================================
*/
router.get("/:id", transit_controller_1.default.findById);
/*
=====================================
Update
=====================================
*/
/*
=====================================
Delete
=====================================
*/
router.delete("/:id", transit_controller_1.default.delete);
exports.default = router;
