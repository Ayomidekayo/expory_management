import { Router } from "express";

import allocationController from "../controllers/allocation.controller";

import authenticate from "../middleware/auth.middleware";
import authorize from "../middleware/authorize.middleware";

const router = Router();

router.use(authenticate);


router.patch(
  "/:id/status",
  authorize(
    "ADMIN",
    "STAFF",
    "OFFICER"
  ),
  allocationController.updateStatus
);
router.get(
  "/",
  allocationController.findAll
);

router.get(
  "/:id",
  allocationController.findOne
);

router.post(
  "/",
  authorize(
    "ADMIN",
    "STAFF",
    "OFFICER"
  ),
  allocationController.create
);

router.patch(
  "/:id",
  authorize(
    "ADMIN",
    "STAFF",
    "OFFICER"
  ),
  allocationController.update
);

router.delete(
  "/:id",
  authorize("ADMIN"),
  allocationController.delete
);

export default router;