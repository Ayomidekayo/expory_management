import { Router } from "express";

import invoiceController from "../controllers/invoice.controller";

import authenticate from "../middleware/auth.middleware";
import requirePermission from "../middleware/permission.middleware";

import { Permission } from "../generated";

const router = Router();

router.use(authenticate);

/*
=====================================
Create Invoice
=====================================
*/

router.post(
  "/",
  requirePermission(Permission.CREATE_INVOICE),
  invoiceController.create
);

/*
=====================================
View Invoices
=====================================
*/

router.get(
  "/",
  requirePermission(Permission.VIEW_INVOICES),
  invoiceController.findAll
);

router.get(
  "/:id",
  requirePermission(Permission.VIEW_INVOICES),
  invoiceController.findOne
);

/*
=====================================
Update Invoice
=====================================
*/

router.patch(
  "/:id",
  requirePermission(Permission.EDIT_INVOICE),
  invoiceController.update
);

/*
=====================================
Update Invoice Status
=====================================
*/

router.patch(
  "/:id/status",
  requirePermission(Permission.EDIT_INVOICE),
  invoiceController.updateStatus
);

/*
=====================================
Delete Invoice
=====================================
*/

router.delete(
  "/:id",
  requirePermission(Permission.DELETE_INVOICE),
  invoiceController.delete
);

export default router;