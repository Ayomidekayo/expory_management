import { Router } from "express";

import { Permission } from "../../../generated";


import {
  listRateCards,
  getRateCardById,
  createRateCard,
  updateRateCard,
  activateRateCard,
} from "./rate-card.controller";
import authenticate from "../../../middleware/auth.middleware";
import requirePermission from "../../../middleware/permission.middleware";

const router = Router();

// All rate-card routes require authentication.
router.use(authenticate);

// GET /rate-cards
// Retrieve rate cards.
router.get(
  "/",
  requirePermission(Permission.VIEW_RATE_CARDS),
  listRateCards,
);

// GET /rate-cards/:id
// Retrieve a rate card and its pricing configuration.
router.get(
  "/:id",
  requirePermission(Permission.VIEW_RATE_CARDS),
  getRateCardById,
);

// POST /rate-cards
// Create a new draft rate card.
router.post(
  "/",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  createRateCard,
);

// PATCH /rate-cards/:id
// Update an existing draft rate card.
router.patch(
  "/:id",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  updateRateCard,
);

// POST /rate-cards/:id/activate
// Activate a validated rate card.
router.post(
  "/:id/activate",
  requirePermission(Permission.ACTIVATE_RATE_CARDS),
  activateRateCard,
);

export default router;