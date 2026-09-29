import { Router } from "express";

import shipmentController from "../controllers/shipment.controller";

import authenticate from "../middleware/auth.middleware";
import requirePermission from "../middleware/permission.middleware";

import { Permission } from "../generated";

const router = Router();

router.use(authenticate);

/*
=====================================
Get All / Available / Statistics
=====================================
*/

/*
 * Get available shipments
 *
 * Must come before "/:id"
 */
router.get(
  "/available",
  requirePermission(Permission.VIEW_SHIPMENTS),
  shipmentController.findAvailable
);

/*
 * Get shipment status counts
 */
router.get(
  "/status-counts",
  requirePermission(Permission.VIEW_SHIPMENTS),
  shipmentController.getStatusCounts
);

/*
 * Get all shipments
 *
 * GET /shipments
 * GET /shipments?status=COMPLETED
 * GET /shipments?status=CANCELLED
 */
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
Update STATUS
=====================================

Only ADMIN should be allowed to
change shipment status.

IMPORTANT:
This route must come before PATCH "/:id".
*/

router.patch(
  "/:id/status",
  requirePermission(Permission.EDIT_SHIPMENT),
  shipmentController.updateStatus
);

/*
=====================================
Update Shipment
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