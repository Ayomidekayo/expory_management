import { Router } from "express";

import shipmentController from "../controllers/shipment.controller";

import authenticate from "../middleware/auth.middleware";
import authorize from "../middleware/authorize.middleware";

const router = Router();

router.use(authenticate);

/*
=====================================
Get All
=====================================
*/
router.get(
  "/available",
  shipmentController.findAvailable
);

router.get(
  "/",
  shipmentController.findAll
);

/*
=====================================
Get One
=====================================
*/

router.get(
  "/:id",
  shipmentController.findOne
);

/*
=====================================
Create
=====================================
*/

router.post(
  "/",
  authorize(
    "ADMIN",
    "STAFF",
    "OFFICER"
  ),
  shipmentController.create
);

/*
=====================================
Update
=====================================
*/

router.patch(
  "/:id",
  authorize(
    "ADMIN",
    "STAFF",
    "OFFICER"
  ),
  shipmentController.update
);

/*
=====================================
Delete
=====================================
*/

router.delete(
  "/:id",
  authorize("ADMIN"),
  shipmentController.delete
);

export default router;