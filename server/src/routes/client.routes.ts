import { Router } from "express";

import clientController from "../controllers/client.controller";
import authenticate from "../middleware/auth.middleware";
import requirePermission from "../middleware/permission.middleware";

import { Permission } from "../generated";

const router = Router();

router.use(authenticate);

/*
=====================================
Client - View
=====================================
*/

router.get(
  "/",
  requirePermission(Permission.VIEW_CLIENTS),
  clientController.findAll
);

router.get(
  "/:id",
  requirePermission(Permission.VIEW_CLIENTS),
  clientController.findOne
);

/*
=====================================
Client - Create
=====================================
*/

router.post(
  "/",
  requirePermission(Permission.CREATE_CLIENT),
  clientController.create
);

/*
=====================================
Client - Update
=====================================
*/

router.patch(
  "/:id",
  requirePermission(Permission.EDIT_CLIENT),
  clientController.update
);

/*
=====================================
Client - Update Status
=====================================
*/

router.patch(
  "/:id/status",
  requirePermission(Permission.EDIT_CLIENT),
  clientController.updateStatus
);

/*
=====================================
Client - Delete
=====================================
*/

router.delete(
  "/:id",
  requirePermission(Permission.DELETE_CLIENT),
  clientController.delete
);

export default router;