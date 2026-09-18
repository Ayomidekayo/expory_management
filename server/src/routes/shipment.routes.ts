import { Router } from "express";

import shipmentController from "../controllers/shipment.controller";

import authenticate from "../middleware/auth.middleware";
import requirePermission from "../middleware/permission.middleware";

import { Permission } from "../generated";

const router = Router();

router.use(authenticate);

/*
=====================================
Get All / Available
=====================================
*/

router.get(
  "/available",
  requirePermission(Permission.VIEW_SHIPMENTS),
  shipmentController.findAvailable
);

router.get(
  "/",
  requirePermission(Permission.VIEW_SHIPMENTS),
  shipmentController.findAll
);

/*
=====================================
Get One
=====================================
*/

router.get(
  "/:id",
  requirePermission(Permission.VIEW_SHIPMENTS),
  shipmentController.findOne
);

/*
=====================================
Create
=====================================
*/

router.post(
  "/",
  requirePermission(Permission.CREATE_SHIPMENT),
  shipmentController.create
);

/*
=====================================
Update
=====================================
*/

router.patch(
  "/:id",
  requirePermission(Permission.EDIT_SHIPMENT),
  shipmentController.update
);

/*
=====================================
Delete
=====================================
*/

router.delete(
  "/:id",
  requirePermission(Permission.DELETE_SHIPMENT),
  shipmentController.delete
);

export default router;