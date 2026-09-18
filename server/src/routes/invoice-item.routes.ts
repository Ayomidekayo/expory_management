import { Router } from "express";

import authenticate from "../middleware/auth.middleware";
import requirePermission from "../middleware/permission.middleware";

import invoiceItemController from "../controllers/invoice-item.controller";

import { Permission } from "../generated";

const router = Router();

router.use(authenticate);

/*
=====================================
Create Invoice Item
=====================================
*/

router.post(
  "/",
  requirePermission(Permission.CREATE_INVOICE),
  invoiceItemController.create
);

/*
=====================================
Find Items By Invoice
=====================================
*/

router.get(
  "/invoice/:invoiceId",
  requirePermission(Permission.VIEW_INVOICES),
  invoiceItemController.findByInvoice
);

/*
=====================================
Find One
=====================================
*/

router.get(
  "/:id",
  requirePermission(Permission.VIEW_INVOICES),
  invoiceItemController.findOne
);

/*
=====================================
Update
=====================================
*/

router.patch(
  "/:id",
  requirePermission(Permission.EDIT_INVOICE),
  invoiceItemController.update
);

/*
=====================================
Delete
=====================================
*/

router.delete(
  "/:id",
  requirePermission(Permission.DELETE_INVOICE),
  invoiceItemController.delete
);

export default router;