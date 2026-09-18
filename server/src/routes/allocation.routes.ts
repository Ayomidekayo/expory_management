import { Router } from "express";

import allocationController from "../controllers/allocation.controller";

import authenticate from "../middleware/auth.middleware";
import requirePermission from "../middleware/permission.middleware";

import { Permission } from "../generated";

const router = Router();

router.use(authenticate);

/*
=====================================
Update Status
=====================================
*/

router.patch(
  "/:id/status",
  requirePermission(Permission.EDIT_ALLOCATION),
  allocationController.updateStatus
);

/*
=====================================
Get All
=====================================
*/

router.get(
  "/",
  requirePermission(Permission.VIEW_ALLOCATIONS),
  allocationController.findAll
);

/*
=====================================
Get One
=====================================
*/

router.get(
  "/:id",
  requirePermission(Permission.VIEW_ALLOCATIONS),
  allocationController.findOne
);

/*
=====================================
Create
=====================================
*/

router.post(
  "/",
  requirePermission(Permission.CREATE_ALLOCATION),
  allocationController.create
);

/*
=====================================
Update
=====================================
*/

router.patch(
  "/:id",
  requirePermission(Permission.EDIT_ALLOCATION),
  allocationController.update
);

/*
=====================================
Delete
=====================================
*/

router.delete(
  "/:id",
  requirePermission(Permission.DELETE_ALLOCATION),
  allocationController.delete
);

export default router;