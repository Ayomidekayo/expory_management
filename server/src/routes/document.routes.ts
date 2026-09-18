import { Router } from "express";

import documentController from "../controllers/document.controller";

import authenticate from "../middleware/auth.middleware";
import requirePermission from "../middleware/permission.middleware";

import { Permission } from "../generated";
import { upload } from "../middleware/upload";

const router = Router();

router.post(
  "/",
  authenticate,
  requirePermission(Permission.UPLOAD_DOCUMENT),
  upload.single("file"),
  documentController.create
);

router.get(
  "/",
  authenticate,
  requirePermission(Permission.VIEW_DOCUMENTS),
  documentController.findAll
);

router.get<{ id: string }>(
  "/:id",
  authenticate,
  requirePermission(Permission.VIEW_DOCUMENTS),
  documentController.findById
);

router.patch<{ id: string }>(
  "/:id",
  authenticate,
  requirePermission(Permission.EDIT_DOCUMENT),
  documentController.update
);

router.delete<{ id: string }>(
  "/:id",
  authenticate,
  requirePermission(Permission.DELETE_DOCUMENT),
  documentController.delete
);

export default router;