import { Router } from "express";
import controller from "../controllers/exporter.controller";
import authenticate from "../middleware/auth.middleware";



const router = Router();

router.use(authenticate);

router.get(
  "/",
  controller.findAll
);

router.get(
  "/:id",
  controller.findById
);

router.post(
  "/",
  controller.create
);

router.patch(
  "/:id",
  controller.update
);

router.delete(
  "/:id",
  controller.delete
);

export default router;