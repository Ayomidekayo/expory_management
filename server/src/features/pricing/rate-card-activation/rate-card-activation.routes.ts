import { Router } from "express";

import {
  activateRateCard,
  archiveRateCard,
  validateRateCard,
} from "./rate-card-activation.controller";

import { Permission } from "../../../generated";
import authenticate from "../../../middleware/auth.middleware";
import requirePermission from "../../../middleware/permission.middleware";

const router = Router();

router.use(authenticate);

// Validate a draft without activating it.
router.post(
  "/rate-cards/:rateCardId/validate",
  requirePermission(Permission.VIEW_RATE_CARDS),
  validateRateCard,
);

// Activate only after successful validation.
router.post(
  "/rate-cards/:rateCardId/activate",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  activateRateCard,
);

// Archive an active rate card.
router.post(
  "/rate-cards/:rateCardId/archive",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  archiveRateCard,
);

export default router;