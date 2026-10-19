import { Router } from "express";

import {
  createRateComponent,
  getRateComponentById,
  listRateComponents,
  updateRateComponent,
} from "./rate-component.controller";

import { Permission } from "../../../generated";
import authenticate from "../../../middleware/auth.middleware";
import requirePermission from "../../../middleware/permission.middleware";

const router = Router();

router.use(authenticate);

// List rate components.
router.get(
  "/rate-cards/:rateCardId/components",
  requirePermission(Permission.VIEW_RATE_CARDS),
  listRateComponents,
);

// Retrieve a specific rate component.
router.get(
  "/components/:componentId",
  requirePermission(Permission.VIEW_RATE_CARDS),
  getRateComponentById,
);

// Create a rate component.
router.post(
  "/rate-cards/:rateCardId/components",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  createRateComponent,
);

// Update a rate component.
router.patch(
  "/components/:componentId",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  updateRateComponent,
);

export default router;