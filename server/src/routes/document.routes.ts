import { Router } from "express";

import documentController from "../controllers/document.controller";

import { upload } from "../middleware/upload";

const router = Router();

/*
=====================================
Upload
=====================================
*/

router.post(
  "/",
  upload.single("file"),
  documentController.create
);

/*
=====================================
Find All
=====================================
*/

router.get(
  "/",
  documentController.findAll
);

/*
=====================================
Find By Id
=====================================
*/

router.get(
  "/:id",
  documentController.findById
);

/*
=====================================
Update
=====================================
*/

router.patch(
  "/:id",
  documentController.update
);

/*
=====================================
Delete
=====================================
*/

router.delete(
  "/:id",
  documentController.delete
);

export default router;