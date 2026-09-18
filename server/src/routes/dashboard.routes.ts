import { Router } from "express";

import authenticate from "../middleware/auth.middleware";
import requirePermission from "../middleware/permission.middleware";

import dashboardController from "../controllers/dashboard.controller";

import { Permission } from "../generated";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission(Permission.VIEW_DASHBOARD),
  dashboardController.getDashboard
);

export default router;