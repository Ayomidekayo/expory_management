
import { Router } from "express";


import { Permission } from "../generated";
import requirePermission from "../middleware/permission.middleware";
import transitMovementController from "../controllers/transit-movement.controller";
import authenticate from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);
/* ===========================================
   GLOBAL COLUMN LOCKS
   Keep these before /:id routes.
=========================================== */

router.get(
  "/column-locks",
  requirePermission(Permission.VIEW_TRANSIT_MOVEMENTS),
  transitMovementController.getColumnLocks,
);

router.patch(
  "/column-locks/:columnKey",
  requirePermission(Permission.LOCK_TRANSIT_MOVEMENT_COLUMNS),
  transitMovementController.updateColumnLock,
);

/* ===========================================
   PAYMENT ROUTES
=========================================== */

router.post(
  "/items/:itemId/payments",
  requirePermission(Permission.MANAGE_TRANSIT_MOVEMENT_PAYMENTS),
  transitMovementController.createPayment,
);

router.get(
  "/items/:itemId/payments",
  requirePermission(Permission.VIEW_TRANSIT_MOVEMENTS),
  transitMovementController.findItemPayments,
);

/* ===========================================
   ITEM LOCK
=========================================== */

router.patch(
  "/items/:itemId/lock",
  requirePermission(Permission.LOCK_TRANSIT_MOVEMENT_ITEMS),
  transitMovementController.updateItemLock,
);

/* ===========================================
   SHIPMENT FILTER
=========================================== */

router.get(
  "/shipment/:shipmentId",
  requirePermission(Permission.VIEW_TRANSIT_MOVEMENTS),
  transitMovementController.findByShipmentId,
);

/* ===========================================
   TRANSIT MOVEMENT CRUD
=========================================== */

router.get(
  "/",
  requirePermission(Permission.VIEW_TRANSIT_MOVEMENTS),
  transitMovementController.findAll,
);

router.post(
  "/",
  requirePermission(Permission.CREATE_TRANSIT_MOVEMENT),
  transitMovementController.create,
);

router.get(
  "/:id",
  requirePermission(Permission.VIEW_TRANSIT_MOVEMENTS),
  transitMovementController.findById,
);

router.patch(
  "/:id",
  requirePermission(Permission.EDIT_TRANSIT_MOVEMENT),
  transitMovementController.update,
);

router.delete(
  "/:id",
  requirePermission(Permission.DELETE_TRANSIT_MOVEMENT),
  transitMovementController.delete,
);

export default router;
