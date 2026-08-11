import { Router } from "express";

import invoiceController from "../controllers/invoice.controller";

import authenticate from "../middleware/auth.middleware";
import authorize from "../middleware/authorize.middleware";

const router = Router();

router.use(authenticate);

/*
=====================================
Invoices
=====================================
*/

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "STAFF"),
  invoiceController.create
);

router.get(
  "/",
  authenticate,
  authorize(
    "ADMIN",
    "STAFF",
    "VIEWER"
  ),
  invoiceController.findAll
);

router.get(
  "/:id",
  authenticate,
  authorize(
    "ADMIN",
    "STAFF",
    "VIEWER"
  ),
  invoiceController.findOne
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN", "STAFF"),
  invoiceController.update
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN", "STAFF"),
  invoiceController.updateStatus
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  invoiceController.delete
);

export default router;