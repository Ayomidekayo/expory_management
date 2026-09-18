import { Router } from "express";

import consigneeController from "../controllers/consignee.controller";

import authenticate from "../middleware/auth.middleware";
import requirePermission from "../middleware/permission.middleware";

import { Permission } from "../generated";

const router = Router();

router.use(authenticate);

/*
=====================================
Consignee - Create
=====================================
*/

router.post(
  "/",
  requirePermission(Permission.CREATE_CONSIGNEE),
  consigneeController.create
);

/*
=====================================
Consignee - View
=====================================
*/

router.get(
  "/",
  requirePermission(Permission.VIEW_CONSIGNEES),
  consigneeController.findAll
);

router.get(
  "/:id",
  requirePermission(Permission.VIEW_CONSIGNEES),
  consigneeController.findOne
);

/*
=====================================
Consignee - Update
=====================================
*/

router.patch(
  "/:id",
  requirePermission(Permission.EDIT_CONSIGNEE),
  consigneeController.update
);

/*
=====================================
Consignee - Delete
=====================================
*/

router.delete(
  "/:id",
  requirePermission(Permission.DELETE_CONSIGNEE),
  consigneeController.delete
);

export default router;