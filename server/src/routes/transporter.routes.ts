import { Router } from "express";

import { prisma } from "../config/prisma";

import { TransporterRepository } from "../Repository/transporter.repository";
import { TransporterService } from "../services/transporter.service";
import { TransporterController } from "../controllers/transporter.controller";

import authenticate from "../middleware/auth.middleware";
import requirePermission from "../middleware/permission.middleware";

import { Permission } from "../generated";

const router = Router();

// ==========================================
// INITIALIZE TRANSPORTER MODULE
// ==========================================

const transporterRepository = new TransporterRepository(prisma);

const transporterService = new TransporterService(
  transporterRepository
);

const transporterController = new TransporterController(
  transporterService
);

router.use(authenticate);

/* ===========================================
   ITEM PAYMENTS
=========================================== */

router.get(
  "/:id/items/:itemId/payments",
  requirePermission(Permission.VIEW_TRANSPORTERS),
  transporterController.getItemPayments,
);

router.post(
  "/:id/items/:itemId/payments",
  requirePermission(Permission.MANAGE_TRANSPORTER_PAYMENTS),
  transporterController.recordPayment,
);

/* ===========================================
   TRANSPORTER CRUD
=========================================== */

router.post(
  "/",
  requirePermission(Permission.CREATE_TRANSPORTER),
  transporterController.create,
);

router.get(
  "/",
  requirePermission(Permission.VIEW_TRANSPORTERS),
  transporterController.getAll,
);

router.get(
  "/:id",
  requirePermission(Permission.VIEW_TRANSPORTERS),
  transporterController.getById,
);

router.patch(
  "/:id",
  requirePermission(Permission.EDIT_TRANSPORTER),
  transporterController.update,
);

router.delete(
  "/:id",
  requirePermission(Permission.DELETE_TRANSPORTER),
  transporterController.delete,
);

/* ===========================================
   TRANSPORTER ITEMS
=========================================== */

router.post(
  "/:id/items",
  requirePermission(Permission.EDIT_TRANSPORTER),
  transporterController.addItem,
);

router.patch(
  "/:id/items/:itemId",
  requirePermission(Permission.EDIT_TRANSPORTER),
  transporterController.updateItem,
);

router.delete(
  "/:id/items/:itemId",
  requirePermission(Permission.EDIT_TRANSPORTER),
  transporterController.deleteItem,
);

export default router;