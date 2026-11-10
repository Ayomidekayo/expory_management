import { Router } from "express";

import transportController from "../controllers/transport.controller";
import { transportPaymentController } from "../controllers/transport-payment.controller";

import authenticate from "../middleware/auth.middleware";
import requirePermission from "../middleware/permission.middleware";

import { Permission } from "../generated";

const router = Router();

router.use(authenticate);

/* ===========================================
   GLOBAL COLUMN LOCKS
=========================================== */

router.get(
  "/column-locks",
  requirePermission(Permission.VIEW_TRANSPORTS),
  transportController.getColumnLocks,
);

router.patch(
  "/column-locks/:columnKey",
  requirePermission(Permission.LOCK_TRANSPORT_COLUMNS),
  transportController.updateColumnLock,
);
router.patch(
  "/items/:itemId/lock",
  requirePermission(Permission.LOCK_TRANSPORT_COLUMNS),
  transportController.updateItemLock,
);

/* ===========================================
   ITEM PAYMENTS
=========================================== */

router.get(
  "/items/:itemId/payments",
  requirePermission(Permission.VIEW_TRANSPORTS),
  transportPaymentController.findPayments,
);

router.post(
  "/items/:itemId/payments",
  requirePermission(Permission.MANAGE_TRANSPORT_PAYMENTS),
  transportPaymentController.createPayment,
);

/* ===========================================
   TRANSPORT CRUD
=========================================== */

router.post(
  "/",
  requirePermission(Permission.CREATE_TRANSPORT),
  transportController.create,
);

router.get(
  "/",
  requirePermission(Permission.VIEW_TRANSPORTS),
  transportController.findAll,
);

router.get(
  "/:id",
  requirePermission(Permission.VIEW_TRANSPORTS),
  transportController.findOne,
);

router.patch(
  "/:id",
  requirePermission(Permission.EDIT_TRANSPORT),
  transportController.update,
);

router.delete(
  "/:id",
  requirePermission(Permission.DELETE_TRANSPORT),
  transportController.delete,
);

export default router;