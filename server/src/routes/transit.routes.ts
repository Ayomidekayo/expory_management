import { Router } from "express";

import transitController from "../controllers/transit.controller";

import authenticate from "../middleware/auth.middleware";
import requirePermission from "../middleware/permission.middleware";

import { Permission } from "../generated";

const router = Router();

router.use(authenticate);

// Create
router.post(
  "/",
  requirePermission(Permission.CREATE_TRANSIT),
  transitController.create
);

// View all
router.get(
  "/",
  requirePermission(Permission.VIEW_TRANSITS),
  transitController.findAll
);

// View one
router.get(
  "/:id",
  requirePermission(Permission.VIEW_TRANSITS),
  transitController.findById
);

// Edit
router.patch(
  "/:id",
  requirePermission(Permission.EDIT_TRANSIT),
  transitController.update
);

// Delete
router.delete(
  "/:id",
  requirePermission(Permission.DELETE_TRANSIT),
  transitController.delete
);

export default router;