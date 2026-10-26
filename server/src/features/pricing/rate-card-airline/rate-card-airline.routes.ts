import { Router } from "express";
import { Permission } from "../../../generated";
import authenticate from "../../../middleware/auth.middleware";
import requirePermission from "../../../middleware/permission.middleware";
import {
  listAirlines,
  getAirlineById,
  createAirline,
  updateAirline,
} from "./rate-card-airline.controller";

const router = Router();
router.use(authenticate);

router.get(
  "/rate-cards/:rateCardId/airlines",
  requirePermission(Permission.VIEW_RATE_CARDS),
  listAirlines,
);
router.get(
  "/rate-cards/:rateCardId/airlines/:id",
  requirePermission(Permission.VIEW_RATE_CARDS),
  getAirlineById,
);
router.post(
  "/rate-cards/:rateCardId/airlines",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  createAirline,
);
router.patch(
  "/rate-cards/:rateCardId/airlines/:id",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  updateAirline,
);

export default router;
