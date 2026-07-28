import { Router } from "express";

import clientController from "../controllers/client.controller";
import authenticate from "../middleware/auth.middleware";
import authorize from "../middleware/authorize.middleware";


const router = Router();

router.use(authenticate);

/*
=====================================
Client CRUD
=====================================
*/

router.get(
  "/",
  clientController.findAll
);

router.get(
  "/:id",
  clientController.findOne
);

router.post(
  "/",
  authorize("ADMIN", "STAFF"),
  clientController.create
);

router.patch(
  "/:id",
  authorize("ADMIN", "STAFF"),
  clientController.update
);

router.patch(
  "/:id/status",
  authorize("ADMIN"),
  clientController.updateStatus
);

router.delete(
  "/:id",
  authorize("ADMIN"),
  clientController.delete
);

export default router;