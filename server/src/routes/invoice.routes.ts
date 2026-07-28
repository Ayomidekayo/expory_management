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

router.get(
  "/",
  invoiceController.findAll
);

router.get(
  "/:id",
  invoiceController.findOne
);

router.post(
  "/",
  authorize(
    "ADMIN",
    "STAFF",
    "OFFICER"
  ),
  invoiceController.create
);

router.patch(
  "/:id",
  authorize(
    "ADMIN",
    "STAFF",
    "OFFICER"
  ),
  invoiceController.update
);

router.delete(
  "/:id",
  authorize("ADMIN"),
  invoiceController.delete
);

export default router;