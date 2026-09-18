import { Router } from "express";

import controller from "../controllers/exporter.controller";

import authenticate from "../middleware/auth.middleware";
import requirePermission from "../middleware/permission.middleware";

import { Permission } from "../generated";

const router = Router();

router.use(authenticate);

/*
=====================================
Exporter - View
=====================================
*/

router.get(
  "/",
  requirePermission(Permission.VIEW_EXPORTERS),
  controller.findAll
);

router.get(
  "/:id",
  requirePermission(Permission.VIEW_EXPORTERS),
  controller.findById
);

/*
=====================================
Exporter - Create
=====================================
*/

router.post(
  "/",
  requirePermission(Permission.CREATE_EXPORTER),
  controller.create
);

/*
=====================================
Exporter - Update
=====================================
*/

router.patch(
  "/:id",
  requirePermission(Permission.EDIT_EXPORTER),
  controller.update
);

/*
=====================================
Exporter - Delete
=====================================
*/

router.delete(
  "/:id",
  requirePermission(Permission.DELETE_EXPORTER),
  controller.delete
);

export default router;