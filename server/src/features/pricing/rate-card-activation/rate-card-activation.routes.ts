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

// Validation is read/preview access; it does not activate the rate card.
router.post(
  "/rate-cards/:rateCardId/validate",
  requirePermission(Permission.VIEW_RATE_CARDS),
  validateRateCard,
);

// Use the dedicated activation permission consistently across activation routes.
router.post(
  "/rate-cards/:rateCardId/activate",
  requirePermission(Permission.ACTIVATE_RATE_CARDS),
  activateRateCard,
);

// Archiving remains a rate-card management operation.
router.post(
  "/rate-cards/:rateCardId/archive",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  archiveRateCard,
);

export default router;
