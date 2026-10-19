import { Router } from "express";
import { rateCardOptionController } from "./rate-card-option.controller";

import { Permission } from "../../../generated";
import requirePermission from "../../../middleware/permission.middleware";
import authenticate from "../../../middleware/auth.middleware";

const router = Router();

// Read-only access
router.get(
  "/configurations/:configurationId/options",
  authenticate,
  requirePermission(Permission.VIEW_RATE_CARDS),
  rateCardOptionController.list,
);
router.get(
  "/rate-card-options/:id",
  authenticate,
  requirePermission(Permission.VIEW_RATE_CARDS),
  rateCardOptionController.getById,
);

// Mutations are allowed only for users who can manage rate cards.
router.post(
  "/configurations/:configurationId/options",
  authenticate,
  requirePermission(Permission.MANAGE_RATE_CARDS),
  rateCardOptionController.create,
);
router.patch(
  "/rate-card-options/:id",
  authenticate,
  requirePermission(Permission.MANAGE_RATE_CARDS),
  rateCardOptionController.update,
);

export default router;
