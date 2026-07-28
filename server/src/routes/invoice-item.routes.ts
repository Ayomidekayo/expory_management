import { Router } from "express";

import authenticate from "../middleware/auth.middleware";
import authorize from "../middleware/authorize.middleware";

import invoiceItemController from "../controllers/invoice-item.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize("ADMIN", "STAFF"),
  invoiceItemController.create
);

router.get(
  "/invoice/:invoiceId",
  invoiceItemController.findByInvoice
);

router.get(
  "/:id",
  invoiceItemController.findOne
);

router.patch(
  "/:id",
  authorize("ADMIN", "STAFF"),
  invoiceItemController.update
);

router.delete(
  "/:id",
  authorize("ADMIN", "STAFF"),
  invoiceItemController.delete
);

export default router;