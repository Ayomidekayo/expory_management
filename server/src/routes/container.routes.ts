import { Router } from "express";

import containerController from "../controllers/container.controller";
import authenticate from "../middleware/auth.middleware";
import authorize from "../middleware/authorize.middleware";

const router = Router();

/*
=====================================
Create
=====================================
*/

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "STAFF"),
  containerController.create
);

/*
=====================================
Find All
=====================================
*/

router.get(
  "/",
  authenticate,
  authorize(
    "ADMIN",
    "STAFF",
    "VIEWER"
  ),
  containerController.findAll
);

/*
=====================================
Find One
=====================================
*/

router.get(
  "/:id",
  authenticate,
  authorize(
    "ADMIN",
    "STAFF",
    "VIEWER"
  ),
  containerController.findById
);

/*
=====================================
Update
=====================================
*/

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN", "STAFF"),
  containerController.update
);

/*
=====================================
Delete
=====================================
*/

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  containerController.delete
);

export default router;