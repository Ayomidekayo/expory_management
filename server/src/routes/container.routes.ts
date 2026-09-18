import { Router } from "express";

import containerController from "../controllers/container.controller";

import authenticate from "../middleware/auth.middleware";
import requirePermission from "../middleware/permission.middleware";

import { Permission } from "../generated";

const router = Router();

/*
=====================================
Create
=====================================
*/

router.post(
  "/",
  authenticate,
  requirePermission(Permission.CREATE_CONTAINER),
  containerController.create
);

/*
=====================================
Find All
=====================================
*/

router.get(
  "/",
  authenticate,
  requirePermission(Permission.VIEW_CONTAINERS),
  containerController.findAll
);

/*
=====================================
Find One
=====================================
*/

router.get(
  "/:id",
  authenticate,
  requirePermission(Permission.VIEW_CONTAINERS),
  containerController.findById
);

/*
=====================================
Update
=====================================
*/

router.patch(
  "/:id",
  authenticate,
  requirePermission(Permission.EDIT_CONTAINER),
  containerController.update
);

/*
=====================================
Update Status
=====================================
*/

router.patch(
  "/:id/status",
  authenticate,
  requirePermission(Permission.EDIT_CONTAINER),
  containerController.updateStatus
);

/*
=====================================
Update Terminal Charge
=====================================
*/

router.patch(
  "/:id/terminal-charge",
  authenticate,
  requirePermission(Permission.EDIT_CONTAINER),
  containerController.updateTerminalCharge
);

/*
=====================================
Delete
=====================================
*/

router.delete(
  "/:id",
  authenticate,
  requirePermission(Permission.DELETE_CONTAINER),
  containerController.delete
);

export default router;