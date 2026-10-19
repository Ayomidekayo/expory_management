import { Router } from "express";

import {
  createWeightSlab,
  deleteWeightSlab,
  getWeightSlabById,
  listWeightSlabs,
  setWeightSlabRates,
  updateWeightSlab,
} from "./weight-slab.controller";
import authenticate from "../../../middleware/auth.middleware";
import requirePermission from "../../../middleware/permission.middleware";


const router = Router();

router.use(authenticate);

// List weight slabs.
router.get(
  "/rate-cards/:rateCardId/weight-slabs",
  requirePermission("VIEW_RATE_CARDS"),
  listWeightSlabs,
);

// Retrieve a specific weight slab.
router.get(
  "/weight-slabs/:weightSlabId",
  requirePermission("VIEW_RATE_CARDS"),
  getWeightSlabById,
);

// Create a weight slab.
router.post(
  "/rate-cards/:rateCardId/weight-slabs",
  requirePermission("MANAGE_RATE_CARDS"),
  createWeightSlab,
);

// Update weight slab details.
router.patch(
  "/weight-slabs/:weightSlabId",
  requirePermission("MANAGE_RATE_CARDS"),
  updateWeightSlab,
);

// Update prices assigned to a weight slab.
router.put(
  "/weight-slabs/:weightSlabId/rates",
  requirePermission("MANAGE_RATE_CARDS"),
  setWeightSlabRates,
);

// Delete a weight slab.
router.delete(
  "/weight-slabs/:weightSlabId",
  requirePermission("MANAGE_RATE_CARDS"),
  deleteWeightSlab,
);

export default router;