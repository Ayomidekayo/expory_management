import {
  Router,
} from "express";

import authenticate from "../middleware/auth.middleware";

import requirePermission from "../middleware/permission.middleware";

import {
  Permission,
} from "../generated";

import gateMovementController from "../controllers/gate-movement.controller";

const router = Router();

router.use(authenticate);

/*
=========================================
STATISTICS
=========================================
*/

router.get(
  "/statistics",

  requirePermission(
    Permission.VIEW_GATES
  ),

  gateMovementController.statistics
);

/*
=========================================
CREATE
=========================================
*/

router.post(
  "/",

  requirePermission(
    Permission.CREATE_GATE
  ),

  gateMovementController.create
);

/*
=========================================
LIST
=========================================
*/

router.get(
  "/",

  requirePermission(
    Permission.VIEW_GATES
  ),

  gateMovementController.findAll
);

/*
=========================================
FIND ONE
=========================================
*/

router.get(
  "/:id",

  requirePermission(
    Permission.VIEW_GATES
  ),

  gateMovementController.findById
);

/*
=========================================
UPDATE STATUS
=========================================
*/

router.patch(
  "/:id/status",

  requirePermission(
    Permission.EDIT_GATE
  ),

  gateMovementController.updateStatus
);

/*
=========================================
UPDATE
=========================================
*/

router.patch(
  "/:id",

  requirePermission(
    Permission.EDIT_GATE
  ),

  gateMovementController.update
);

/*
=========================================
DELETE
=========================================
*/

router.delete(
  "/:id",

  requirePermission(
    Permission.DELETE_GATE
  ),

  gateMovementController.delete
);

export default router;