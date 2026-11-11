
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createTransitMovementSchema,
  updateTransitMovementSchema,
} from "../validations/transit-movement.validation";

import {
  transitMovementQuerySchema,
} from "../validations/transit-movement-query.validation";

import {
  updateTransitMovementColumnLockSchema,
  updateTransitMovementItemLockSchema,
  transitMovementColumnKeySchema,
} from "../validations/transit-movement-column-lock.validation";

import {
  createTransitMovementPaymentSchema,
} from "../validations/transit-movement-payment.validation";

import transitMovementService from "../services/transit-movement.service";

/* ===========================================
   TRANSIT MOVEMENT CONTROLLER
=========================================== */

class TransitMovementController {

  /* ===========================================
     PARAMETER HELPER
  =========================================== */

  private getParam(
    value: string | string[] | undefined,
  ): string {
    return Array.isArray(value)
      ? value[0] ?? ""
      : value ?? "";
  }

  /* ===========================================
     CREATE TRANSIT MOVEMENT
  =========================================== */

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = createTransitMovementSchema.safeParse(
        req.body,
      );

      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Invalid Transit Movement data.",
          errors: parsed.error.flatten(),
        });
        return;
      }

      const movement =
        await transitMovementService.create(parsed.data);

      res.status(201).json({
        success: true,
        message: "Transit Movement created successfully.",
        data: movement,
      });
    } catch (error) {
      next(error);
    }
  };

  /* ===========================================
     GET ALL TRANSIT MOVEMENTS
  =========================================== */

  findAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = transitMovementQuerySchema.safeParse(
        req.query,
      );

      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Invalid Transit Movement query.",
          errors: parsed.error.flatten(),
        });
        return;
      }

      const result =
        await transitMovementService.findAll(parsed.data);

      res.status(200).json({
        success: true,
        message: "Transit Movements retrieved successfully.",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  /* ===========================================
     GET ONE TRANSIT MOVEMENT
  =========================================== */

  findById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = this.getParam(req.params.id);

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Transit Movement ID is required.",
        });
        return;
      }

      const movement =
        await transitMovementService.findById(id);

      res.status(200).json({
        success: true,
        message: "Transit Movement retrieved successfully.",
        data: movement,
      });
    } catch (error) {
      next(error);
    }
  };

  /* ===========================================
     FIND TRANSIT MOVEMENTS BY SHIPMENT
  =========================================== */

  findByShipmentId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const shipmentId = this.getParam(
        req.params.shipmentId,
      );

      if (!shipmentId) {
        res.status(400).json({
          success: false,
          message: "Shipment ID is required.",
        });
        return;
      }

      const movements =
        await transitMovementService.findByShipmentId(
          shipmentId,
        );

      res.status(200).json({
        success: true,
        message: "Transit Movements retrieved successfully.",
        data: movements,
      });
    } catch (error) {
      next(error);
    }
  };

  /* ===========================================
     UPDATE TRANSIT MOVEMENT
  =========================================== */

  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = this.getParam(req.params.id);

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Transit Movement ID is required.",
        });
        return;
      }

      const parsed = updateTransitMovementSchema.safeParse(
        req.body,
      );

      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Invalid Transit Movement data.",
          errors: parsed.error.flatten(),
        });
        return;
      }

      const movement =
        await transitMovementService.update(
          id,
          parsed.data,
        );

      res.status(200).json({
        success: true,
        message: "Transit Movement updated successfully.",
        data: movement,
      });
    } catch (error) {
      next(error);
    }
  };

  /* ===========================================
     DELETE TRANSIT MOVEMENT
  =========================================== */

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = this.getParam(req.params.id);

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Transit Movement ID is required.",
        });
        return;
      }

      await transitMovementService.delete(id);

      res.status(200).json({
        success: true,
        message: "Transit Movement deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  };

  /* ===========================================
     RECORD ITEM PAYMENT
  =========================================== */

  createPayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed =
        createTransitMovementPaymentSchema.safeParse(
          req.body,
        );

      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Invalid payment information.",
          errors: parsed.error.flatten(),
        });
        return;
      }

      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          message: "Authentication required to record payment.",
        });
        return;
      }

      const itemId = this.getParam(
        req.params.itemId,
      );

      if (!itemId) {
        res.status(400).json({
          success: false,
          message: "Transit Movement item ID is required.",
        });
        return;
      }

      const payment =
        await transitMovementService.createPayment(
          itemId,
          parsed.data,
          req.user.id,
        );

      res.status(201).json({
        success: true,
        message: "Payment recorded successfully.",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  };

  /* ===========================================
     GET ITEM PAYMENT HISTORY
  =========================================== */

  findItemPayments = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const itemId = this.getParam(
        req.params.itemId,
      );

      if (!itemId) {
        res.status(400).json({
          success: false,
          message: "Transit Movement item ID is required.",
        });
        return;
      }

      const payments =
        await transitMovementService.findItemPayments(
          itemId,
        );

      res.status(200).json({
        success: true,
        message: "Payment history retrieved successfully.",
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  };

  /* ===========================================
     LOCK / UNLOCK ITEM
  =========================================== */

  updateItemLock = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed =
        updateTransitMovementItemLockSchema.safeParse(
          req.body,
        );

      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Invalid item lock information.",
          errors: parsed.error.flatten(),
        });
        return;
      }

      const itemId = this.getParam(
        req.params.itemId,
      );

      if (!itemId) {
        res.status(400).json({
          success: false,
          message: "Transit Movement item ID is required.",
        });
        return;
      }

      const item =
        await transitMovementService.updateItemLock(
          itemId,
          parsed.data.isLocked,
        );

      res.status(200).json({
        success: true,
        message: parsed.data.isLocked
          ? "Transit Movement item locked successfully."
          : "Transit Movement item unlocked successfully.",
        data: item,
      });
    } catch (error) {
      next(error);
    }
  };

  /* ===========================================
     GET GLOBAL COLUMN LOCKS
  =========================================== */

  getColumnLocks = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const locks =
        await transitMovementService.getColumnLocks();

      res.status(200).json({
        success: true,
        message: "Column locks retrieved successfully.",
        data: locks,
      });
    } catch (error) {
      next(error);
    }
  };

  /* ===========================================
     UPDATE GLOBAL COLUMN LOCK
  =========================================== */

  updateColumnLock = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const keyParsed =
        transitMovementColumnKeySchema.safeParse(
          req.params.columnKey,
        );

      if (!keyParsed.success) {
        res.status(400).json({
          success: false,
          message: "Invalid Transit Movement column key.",
        });
        return;
      }

      const bodyParsed =
        updateTransitMovementColumnLockSchema.safeParse(
          req.body,
        );

      if (!bodyParsed.success) {
        res.status(400).json({
          success: false,
          message: "Invalid column lock information.",
          errors: bodyParsed.error.flatten(),
        });
        return;
      }

      const lock =
        await transitMovementService.updateColumnLock(
          keyParsed.data,
          bodyParsed.data,
          req.user?.id,
        );

      res.status(200).json({
        success: true,
        message: bodyParsed.data.isLocked
          ? "Column locked successfully."
          : "Column unlocked successfully.",
        data: lock,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new TransitMovementController();
