import { Router } from "express";

import {
  createPricingSection,
  getPricingSectionById,
  listPricingSections,
  updatePricingSection,
} from "./rate-card-pricing-section.controller";

import { Permission } from "../../../generated";
import authenticate from "../../../middleware/auth.middleware";
import requirePermission from "../../../middleware/permission.middleware";

const router = Router();

router.use(authenticate);

// List pricing sections.
router.get(
  "/configurations/:configurationId/pricing-sections",
  requirePermission(Permission.VIEW_RATE_CARDS),
  listPricingSections,
);

// Retrieve a specific pricing section.
router.get(
  "/pricing-sections/:sectionId",
  requirePermission(Permission.VIEW_RATE_CARDS),
  getPricingSectionById,
);

// Create a pricing section.
router.post(
  "/configurations/:configurationId/pricing-sections",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  createPricingSection,
);

// Update a pricing section.
router.patch(
  "/pricing-sections/:sectionId",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  updatePricingSection,
);

export default router;