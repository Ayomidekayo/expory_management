import { Router } from "express";

import {
  createConfiguration,
  getConfigurationById,
  listConfigurations,
  updateConfiguration,
} from "./rate-card-configuration.controller";

import { Permission } from "../../../generated";
import authenticate from "../../../middleware/auth.middleware";
import requirePermission from "../../../middleware/permission.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/rate-cards/:rateCardId/configurations",
  requirePermission(Permission.VIEW_RATE_CARDS),
  listConfigurations,
);

router.get(
  "/configurations/:id",
  requirePermission(Permission.VIEW_RATE_CARDS),
  getConfigurationById,
);

router.post(
  "/rate-cards/:rateCardId/configurations",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  createConfiguration,
);

router.patch(
  "/configurations/:id",
  requirePermission(Permission.MANAGE_RATE_CARDS),
  updateConfiguration,
);

export default router;