import { Router } from "express";
import authenticate from "../middleware/auth.middleware";
import allocationDocumentController from "../controllers/allocation.document.controller";
import upload from "../middleware/upload.middleware";

const router = Router();

/*
=========================================
All Allocation Routes Require Login
=========================================
*/

router.use(authenticate);
router.post(
  "/:id/documents",
  upload.single("file"),
  allocationDocumentController.create
);

router.get(
  "/:id/documents",
  allocationDocumentController.findAll
);

router.delete(
  "/documents/:documentId",
  allocationDocumentController.delete
);

export default router;