import { Router } from "express";

import authenticate from "../middleware/auth.middleware";
import requirePermission from "../middleware/permission.middleware";

import { Permission } from "../generated";

import invoicePaymentController from "../controllers/invoice-payment.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  requirePermission(
    Permission.EDIT_INVOICE
  ),
  invoicePaymentController.create
);

router.get(
  "/invoice/:invoiceId",
  requirePermission(
    Permission.VIEW_INVOICES
  ),
  invoicePaymentController.findByInvoiceId
);

router.get(
  "/:id",
  requirePermission(
    Permission.VIEW_INVOICES
  ),
  invoicePaymentController.findById
);

router.patch(
  "/:id",
  requirePermission(
    Permission.EDIT_INVOICE
  ),
  invoicePaymentController.update
);

router.delete(
  "/:id",
  requirePermission(
    Permission.DELETE_INVOICE
  ),
  invoicePaymentController.delete
);

export default router;