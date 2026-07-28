import { Router } from "express";
import packingListController from "../controllers/packing-list.controller";
import authenticate from "../middleware/auth.middleware";
import authorize from "../middleware/authorize.middleware";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize("ADMIN", "STAFF"),
  packingListController.create
);

router.get(
  "/",
  packingListController.findAll
);

router.get(
  "/:id",
  packingListController.findOne
);

router.patch(
  "/:id",
  authorize("ADMIN", "STAFF"),
  packingListController.update
);


router.delete(
  "/:id",
  authorize("ADMIN", "STAFF"),
  packingListController.delete
);

export default router;