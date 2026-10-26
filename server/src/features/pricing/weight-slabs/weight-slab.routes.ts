import { Router } from "express";
import { Permission } from "../../../generated";
import authenticate from "../../../middleware/auth.middleware";
import requirePermission from "../../../middleware/permission.middleware";
import {
  createWeightSlab,
  createWeightSlabMatrix,
  deleteWeightSlab,
  getWeightSlabById,
  listWeightSlabs,
  setWeightSlabRates,
  updateWeightSlab,
} from "./weight-slab.controller";

const router = Router();
router.use(authenticate);

// Read routes.
router.get(
  "/rate-cards/:rateCardId/weight-slabs",
  requirePermission(Permission.VIEW_RATE_CARDS),
  listWeightSlabs,
);
router.get(
  "/weight-slabs/:weightSlabId",
  requirePermission(Permission.VIEW_RATE_CARDS),
  getWeightSlabById,
);

// Weight slab mutations and rate writes.
router.post(
  "/rate-cards/:rateCardId/weight-slabs",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  createWeightSlab,
);
router.post(
  "/rate-cards/:rateCardId/weight-slabs/matrix",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  createWeightSlabMatrix,
);
router.patch(
  "/weight-slabs/:weightSlabId",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  updateWeightSlab,
);
router.put(
  "/weight-slabs/:weightSlabId/rates",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  setWeightSlabRates,
);
router.delete(
  "/weight-slabs/:weightSlabId",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  deleteWeightSlab,
);

export default router;
