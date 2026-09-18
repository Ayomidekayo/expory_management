import { Router } from "express";

import packingListController from "../controllers/packing-list.controller";

import authenticate from "../middleware/auth.middleware";
import requirePermission from "../middleware/permission.middleware";

import { Permission } from "../generated";

const router = Router();

router.use(authenticate);

// Create
router.post(
  "/",
  requirePermission(Permission.CREATE_PACKING_LIST),
  packingListController.create
);

// View all
router.get(
  "/",
  requirePermission(Permission.VIEW_PACKING_LISTS),
  packingListController.findAll
);

// View one
router.get(
  "/:id",
  requirePermission(Permission.VIEW_PACKING_LISTS),
  packingListController.findOne
);

// Edit
router.patch(
  "/:id",
  requirePermission(Permission.EDIT_PACKING_LIST),
  packingListController.update
);

// Delete
router.delete(
  "/:id",
  requirePermission(Permission.DELETE_PACKING_LIST),
  packingListController.delete
);

export default router;